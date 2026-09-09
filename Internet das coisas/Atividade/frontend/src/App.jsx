import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const blank = { cliente_id: '', profissional_id: '', tipo_servico: 'RESIDENCIAL', data: '', hora: '', duracao_minutos: '120', endereco: '', necessidades: '', status: 'PENDENTE' }
const pad = value => String(value).padStart(2, '0')
const dateForInput = value => { const date = new Date(value); return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` }
const timeForInput = value => { const date = new Date(value); return `${pad(date.getHours())}:${pad(date.getMinutes())}` }
const request = async (path, options = {}, token = '') => {
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } })
  if (response.status === 204) return null
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Não foi possível concluir a operação.')
  return data
}

function App() {
  const [session, setSession] = useState(null)
  const [authMode, setAuthMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [bookings, setBookings] = useState([])
  const [clients, setClients] = useState([])
  const [professionals, setProfessionals] = useState([])
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [screen, setScreen] = useState('dashboard')
  const [now, setNow] = useState(() => Date.now())

  const loadData = async (token, term = '') => {
    setLoading(true)
    try {
      const [items, clientList, professionalList] = await Promise.all([
        request(`/agendamentos?search=${encodeURIComponent(term)}`, {}, token), request('/clientes', {}, token), request('/profissionais', {}, token),
      ])
      setBookings(items); setClients(clientList); setProfessionals(professionalList)
    } catch (error) { setNotice(error.message) } finally { setLoading(false) }
  }
  useEffect(() => {
    if (!session) return undefined
    const timer = setTimeout(() => { void loadData(session.token, search) }, 0)
    return () => clearTimeout(timer)
  }, [session, search])
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(timer)
  }, [])

  const ordered = useMemo(() => [...bookings].sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora)), [bookings])
  const upcoming = useMemo(() => ordered.filter(item => {
    const hours = (new Date(item.data_hora).valueOf() - now) / 3_600_000
    return hours >= 0 && hours <= 24
  }), [ordered, now])
  const login = async (event) => {
    event.preventDefault(); setLoginError('')
    try { setSession(await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha: password }) })); setScreen('dashboard') }
    catch (error) { setLoginError(error.message) }
  }
  const register = async (event) => {
    event.preventDefault(); setLoginError('')
    if (password.length < 8) return setLoginError('A senha deve ter pelo menos 8 caracteres.')
    if (password !== confirmPassword) return setLoginError('As senhas não coincidem.')
    try {
      await request('/auth/cadastro', { method: 'POST', body: JSON.stringify({ nome: name, email, senha: password }) })
      setAuthMode('login'); setPassword(''); setConfirmPassword('')
      setLoginError('Cadastro realizado. Entre com seus dados para continuar.')
    } catch (error) { setLoginError(error.message) }
  }
  const change = event => setForm({ ...form, [event.target.name]: event.target.value })
  const chooseClient = event => {
    const client = clients.find(item => item.id === Number(event.target.value))
    setForm({ ...form, cliente_id: event.target.value, endereco: client?.endereco || form.endereco })
  }
  const save = async event => {
    event.preventDefault(); setNotice('')
    const fields = ['cliente_id', 'profissional_id', 'data', 'hora', 'endereco']
    if (fields.some(field => !form[field])) return setNotice('Preencha todos os campos obrigatórios.')
    const payload = { cliente_id: Number(form.cliente_id), profissional_id: Number(form.profissional_id), tipo_servico: form.tipo_servico, data_hora: `${form.data}T${form.hora}:00`, duracao_minutos: Number(form.duracao_minutos), endereco: form.endereco, necessidades: form.necessidades, status: form.status }
    try {
      await request(editing ? `/agendamentos/${editing}` : '/agendamentos', { method: editing ? 'PUT' : 'POST', body: JSON.stringify(payload) }, session.token)
      setNotice(editing ? 'Agendamento atualizado com sucesso.' : 'Agendamento cadastrado com sucesso.')
      setForm(blank); setEditing(null); loadData(session.token, search)
    } catch (error) { setNotice(error.message) }
  }
  const edit = item => {
    setForm({ cliente_id: String(item.cliente_id), profissional_id: String(item.profissional_id), tipo_servico: item.tipo_servico, data: dateForInput(item.data_hora), hora: timeForInput(item.data_hora), duracao_minutos: String(item.duracao_minutos || 120), endereco: item.endereco, necessidades: item.necessidades || '', status: item.status })
    setEditing(item.id); setNotice('Editando agendamento selecionado.'); setScreen('booking')
  }
  const remove = async id => {
    if (!window.confirm('Deseja excluir este agendamento?')) return
    try { await request(`/agendamentos/${id}`, { method: 'DELETE' }, session.token); setNotice('Agendamento excluído.'); loadData(session.token, search) }
    catch (error) { setNotice(error.message) }
  }

  if (!session) return <main className="login"><section className="login-card"><span className="brand">Brilho & Ordem</span><h1>Gestão de faxinas</h1><p>{authMode === 'login' ? 'Acesse sua conta para organizar os serviços.' : 'Crie sua conta para começar a organizar os serviços.'}</p><div className="auth-tabs" role="tablist"><button type="button" role="tab" aria-selected={authMode === 'login'} className={authMode === 'login' ? 'active' : ''} onClick={() => { setAuthMode('login'); setLoginError('') }}>Entrar</button><button type="button" role="tab" aria-selected={authMode === 'register'} className={authMode === 'register' ? 'active' : ''} onClick={() => { setAuthMode('register'); setLoginError('') }}>Cadastrar</button></div>{authMode === 'login' ? <form onSubmit={login}><label>E-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label><label>Senha<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>{loginError && <div className={loginError.startsWith('Cadastro realizado') ? 'alert' : 'alert error'}>{loginError}</div>}<button>Entrar</button></form> : <form onSubmit={register}><label>Nome<input value={name} onChange={e => setName(e.target.value)} required /></label><label>E-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label><label>Senha<input type="password" minLength="8" value={password} onChange={e => setPassword(e.target.value)} required /></label><label>Confirmar senha<input type="password" minLength="8" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></label>{loginError && <div className="alert error">{loginError}</div>}<button>Criar conta</button></form>}</section></main>

  return <main className="app">
    <header><div><span className="brand">Brilho & Ordem</span><h1>{screen === 'dashboard' ? 'Painel principal' : screen === 'booking' ? 'Cadastro de agendamento' : 'Gestão de agendamentos'}</h1></div><div className="user">Olá, {session.user.nome}<button className="secondary" onClick={() => setSession(null)}>Sair</button></div></header>
    <nav className="screen-nav"><button className={screen === 'dashboard' ? 'active' : ''} onClick={() => setScreen('dashboard')}>Principal</button><button className={screen === 'booking' ? 'active' : ''} onClick={() => setScreen('booking')}>Cadastrar agendamento</button><button className={screen === 'manage' ? 'active' : ''} onClick={() => setScreen('manage')}>Gerir agendamentos</button></nav>
    {screen === 'dashboard' && <><section className="stats"><article><b>{bookings.length}</b><span>Agendamentos ativos</span></article><article><b>{clients.length}</b><span>Clientes</span></article><article><b>{professionals.length}</b><span>Profissionais</span></article></section>{upcoming.length > 0 && <section className="alert"><b>Atenção:</b> há {upcoming.length} serviço(s) agendado(s) para as próximas 24 horas.</section>}</>}
    {screen === 'booking' && <section className="panel"><div className="panel-title"><h2>{editing ? 'Editar agendamento' : 'Novo agendamento'}</h2>{editing && <button className="link" onClick={() => { setEditing(null); setForm(blank) }}>Cancelar edição</button>}</div><form className="booking-form" onSubmit={save}><label>Cliente *<select value={form.cliente_id} onChange={chooseClient}><option value="">Selecione</option>{clients.map(item => <option value={item.id} key={item.id}>{item.nome}</option>)}</select></label><label>Profissional *<select name="profissional_id" value={form.profissional_id} onChange={change}><option value="">Selecione</option>{professionals.map(item => <option value={item.id} key={item.id}>{item.nome}</option>)}</select></label><label>Tipo de faxina *<select name="tipo_servico" value={form.tipo_servico} onChange={change}><option value="RESIDENCIAL">Residencial</option><option value="COMERCIAL">Comercial</option></select></label><label>Data *<input name="data" type="date" value={form.data} onChange={change} /></label><label>Horário *<input name="hora" type="time" value={form.hora} onChange={change} /></label><label>Duração (minutos) *<input name="duracao_minutos" type="number" min="30" max="720" value={form.duracao_minutos} onChange={change} /></label><label>Status<select name="status" value={form.status} onChange={change}><option value="PENDENTE">Pendente</option><option value="CONFIRMADO">Confirmado</option><option value="CONCLUIDO">Concluído</option></select></label><label className="wide">Endereço *<input name="endereco" value={form.endereco} onChange={change} /></label><label className="wide">Necessidades do serviço<textarea name="necessidades" value={form.necessidades} onChange={change} /></label><button>{editing ? 'Salvar alterações' : 'Cadastrar agendamento'}</button></form>{notice && <div className="alert">{notice}</div>}</section>}
    {screen === 'manage' && <><section className="panel"><div className="panel-title"><h2>Lista de agendamentos</h2><input className="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente, profissional ou serviço" /></div><div className="table-wrap"><table><thead><tr><th>Data / hora</th><th>Cliente</th><th>Serviço</th><th>Profissional</th><th>Status</th><th>Ações</th></tr></thead><tbody>{loading ? <tr><td colSpan="6">Carregando...</td></tr> : bookings.length ? bookings.map(item => <tr key={item.id}><td>{new Date(item.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</td><td><strong>{item.cliente_nome}</strong><small>{item.endereco}</small></td><td>{item.tipo_servico}<small>{item.duracao_minutos} min. — {item.necessidades}</small></td><td>{item.profissional_nome}</td><td><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span></td><td className="actions"><button className="link" onClick={() => edit(item)}>Editar</button><button className="danger" onClick={() => remove(item.id)}>Excluir</button></td></tr>) : <tr><td colSpan="6">Nenhum agendamento encontrado.</td></tr>}</tbody></table></div></section><section className="panel schedule"><h2>Agenda cronológica</h2><p>Serviços ordenados automaticamente por data e horário.</p><ol>{ordered.map(item => <li key={item.id}><b>{new Date(item.data_hora).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</b> — {item.cliente_nome}, {item.tipo_servico.toLowerCase()} com {item.profissional_nome}</li>)}</ol></section></>}
  </main>
}

export default App
