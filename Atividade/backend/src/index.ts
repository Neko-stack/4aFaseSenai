import express, { type Request, type Response } from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Pool } from 'pg'

const app = express()
const port = Number(process.env.PORT || 3000)
const tokenSecret = process.env.JWT_SECRET || 'troque-esta-chave-em-producao'
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:123@localhost:5432/faxina_db' })

app.use(cors())
app.use(express.json())

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; nome: string; perfil: string }
    }
  }
}
type AuthRequest = Request

const authenticate = (req: AuthRequest, res: Response, next: () => void) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) { res.status(401).json({ message: 'Token de autenticação não informado.' }); return }
  try { req.user = jwt.verify(token, tokenSecret) as { id: number; nome: string; perfil: string }; next() }
  catch { res.status(401).json({ message: 'Sessão inválida ou expirada.' }) }
}

const required = (body: Record<string, unknown>, fields: string[]) => fields.filter(field => !body[field])

app.get('/', (_, res) => res.json({ service: 'API Brilho & Ordem', status: 'online' }))
app.get('/health', async (_, res) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'ok', database: 'connected' }) }
  catch { res.status(503).json({ status: 'error', database: 'unavailable' }) }
})

app.post('/auth/login', async (req, res) => {
  const missing = required(req.body, ['email', 'senha'])
  if (missing.length) { res.status(400).json({ message: 'E-mail e senha são obrigatórios.' }); return }
  const result = await pool.query('SELECT id, nome, email, senha_hash, perfil FROM usuario WHERE email = $1', [req.body.email])
  const user = result.rows[0]
  if (!user || !(await bcrypt.compare(req.body.senha, user.senha_hash))) { res.status(401).json({ message: 'E-mail ou senha inválidos.' }); return }
  const token = jwt.sign({ id: user.id, nome: user.nome, perfil: user.perfil }, tokenSecret, { expiresIn: '8h' })
  res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, perfil: user.perfil } })
})

app.post('/auth/cadastro', async (req, res) => {
  const missing = required(req.body, ['nome', 'email', 'senha'])
  if (missing.length) { res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' }); return }
  const { nome, email, senha } = req.body
  if (typeof senha !== 'string' || senha.length < 8) { res.status(400).json({ message: 'A senha deve ter pelo menos 8 caracteres.' }); return }
  const exists = await pool.query('SELECT id FROM usuario WHERE email = $1', [email])
  if (exists.rowCount) { res.status(409).json({ message: 'Já existe uma conta com este e-mail.' }); return }
  const senhaHash = await bcrypt.hash(senha, 10)
  const result = await pool.query("INSERT INTO usuario (nome, email, senha_hash, perfil) VALUES ($1, $2, $3, 'OPERADOR') RETURNING id, nome, email, perfil", [nome, email, senhaHash])
  res.status(201).json({ user: result.rows[0] })
})

app.get('/clientes', authenticate, async (_, res) => res.json((await pool.query('SELECT * FROM cliente ORDER BY nome')).rows))
app.post('/clientes', authenticate, async (req, res) => {
  const missing = required(req.body, ['nome', 'telefone', 'endereco'])
  if (missing.length) { res.status(400).json({ message: `Campos obrigatórios: ${missing.join(', ')}.` }); return }
  const { nome, telefone, email, endereco } = req.body
  const result = await pool.query('INSERT INTO cliente (nome, telefone, email, endereco) VALUES ($1,$2,$3,$4) RETURNING *', [nome, telefone, email || null, endereco])
  res.status(201).json(result.rows[0])
})

app.get('/profissionais', authenticate, async (_, res) => res.json((await pool.query('SELECT * FROM profissional WHERE ativo = TRUE ORDER BY nome')).rows))
app.post('/profissionais', authenticate, async (req, res) => {
  const missing = required(req.body, ['nome', 'telefone'])
  if (missing.length) { res.status(400).json({ message: `Campos obrigatórios: ${missing.join(', ')}.` }); return }
  const { nome, telefone, email, hora_inicio = '08:00', hora_fim = '18:00' } = req.body
  const result = await pool.query('INSERT INTO profissional (nome, telefone, email, hora_inicio, hora_fim) VALUES ($1,$2,$3,$4,$5) RETURNING *', [nome, telefone, email || null, hora_inicio, hora_fim])
  res.status(201).json(result.rows[0])
})

app.get('/agendamentos', authenticate, async (req, res) => {
  const search = String(req.query.search || '')
  const result = await pool.query(`SELECT a.*, c.nome AS cliente_nome, p.nome AS profissional_nome
    FROM agendamento a JOIN cliente c ON c.id = a.cliente_id JOIN profissional p ON p.id = a.profissional_id
    WHERE a.status <> 'CANCELADO' AND (LOWER(c.nome) LIKE LOWER($1) OR LOWER(p.nome) LIKE LOWER($1) OR LOWER(a.tipo_servico) LIKE LOWER($1))
    ORDER BY a.data_hora ASC`, [`%${search}%`])
  res.json(result.rows)
})

async function saveBooking(req: AuthRequest, res: Response, id?: number) {
  const missing = required(req.body, ['cliente_id', 'profissional_id', 'tipo_servico', 'data_hora', 'endereco'])
  if (missing.length) { res.status(400).json({ message: `Campos obrigatórios: ${missing.join(', ')}.` }); return }
  const { cliente_id, profissional_id, tipo_servico, data_hora, endereco, necessidades, status = 'PENDENTE', duracao_minutos = 120 } = req.body
  const duration = Number(duracao_minutos)
  if (!Number.isInteger(duration) || duration < 30 || duration > 720) { res.status(400).json({ message: 'A duração deve estar entre 30 e 720 minutos.' }); return }
  const professional = await pool.query('SELECT hora_inicio, hora_fim FROM profissional WHERE id = $1 AND ativo = TRUE', [profissional_id])
  if (!professional.rowCount) { res.status(400).json({ message: 'Profissional inexistente ou indisponível.' }); return }
  const parsedDateTime = String(data_hora).match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::\d{2})?$/)
  if (!parsedDateTime) { res.status(400).json({ message: 'Data e horário inválidos.' }); return }
  const [, date, hour, minute] = parsedDateTime
  const startMinutes = Number(hour) * 60 + Number(minute)
  const endMinutes = startMinutes + duration
  if (Number(hour) > 23 || Number(minute) > 59 || endMinutes > 1_440) { res.status(400).json({ message: 'Data, horário ou duração inválidos.' }); return }
  const time = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
  const startTime = time(startMinutes)
  const endTime = time(endMinutes)
  const startTimestamp = `${date} ${startTime}:00`
  const endTimestamp = `${date} ${endTime}:00`
  const { hora_inicio, hora_fim } = professional.rows[0]
  if (startTime < hora_inicio.slice(0, 5) || endTime > hora_fim.slice(0, 5)) {
    res.status(409).json({ message: `Profissional disponível somente das ${hora_inicio.slice(0, 5)} às ${hora_fim.slice(0, 5)}.` }); return
  }
  const conflict = await pool.query(`SELECT id FROM agendamento
    WHERE profissional_id = $1 AND status <> 'CANCELADO' AND id <> $2
      AND data_hora < $3::timestamp
      AND data_hora + (duracao_minutos * INTERVAL '1 minute') > $4::timestamp`, [profissional_id, id || 0, endTimestamp, startTimestamp])
  if (conflict.rowCount) { res.status(409).json({ message: 'Conflito: profissional já possui serviço neste horário.' }); return }
  const values = [cliente_id, profissional_id, tipo_servico, data_hora, duration, endereco, necessidades || null, status]
  const result = id
    ? await pool.query('UPDATE agendamento SET cliente_id=$1, profissional_id=$2, tipo_servico=$3, data_hora=$4, duracao_minutos=$5, endereco=$6, necessidades=$7, status=$8 WHERE id=$9 RETURNING *', [...values, id])
    : await pool.query('INSERT INTO agendamento (cliente_id, profissional_id, tipo_servico, data_hora, duracao_minutos, endereco, necessidades, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *', values)
  if (!result.rowCount) { res.status(404).json({ message: 'Agendamento não encontrado.' }); return }
  await pool.query('INSERT INTO historico_agendamento (agendamento_id, usuario_id, acao, descricao) VALUES ($1,$2,$3,$4)', [result.rows[0].id, req.user?.id || null, id ? 'ATUALIZACAO' : 'CRIACAO', id ? 'Agendamento atualizado.' : 'Agendamento criado.'])
  res.status(id ? 200 : 201).json(result.rows[0])
}

app.post('/agendamentos', authenticate, (req: AuthRequest, res) => saveBooking(req, res))
app.put('/agendamentos/:id', authenticate, (req: AuthRequest, res) => saveBooking(req, res, Number(req.params.id)))
app.delete('/agendamentos/:id', authenticate, async (req: AuthRequest, res) => {
  const result = await pool.query("UPDATE agendamento SET status = 'CANCELADO' WHERE id = $1 AND status <> 'CANCELADO' RETURNING id", [req.params.id])
  if (!result.rowCount) { res.status(404).json({ message: 'Agendamento não encontrado.' }); return }
  await pool.query('INSERT INTO historico_agendamento (agendamento_id, usuario_id, acao, descricao) VALUES ($1,$2,$3,$4)', [result.rows[0].id, req.user?.id || null, 'EXCLUSAO', 'Agendamento cancelado pelo usuário.'])
  res.status(204).send()
})

app.get('/agendamentos/:id/historico', authenticate, async (req, res) => {
  const result = await pool.query(`SELECT h.*, u.nome AS usuario_nome FROM historico_agendamento h
    LEFT JOIN usuario u ON u.id = h.usuario_id WHERE h.agendamento_id = $1 ORDER BY h.data_operacao DESC`, [req.params.id])
  res.json(result.rows)
})

app.use((error: Error, _: Request, res: Response, __: () => void) => { console.error(error); res.status(500).json({ message: 'Erro interno do servidor.' }) })
app.listen(port, () => console.log(`API Brilho & Ordem em http://localhost:${port}`))
