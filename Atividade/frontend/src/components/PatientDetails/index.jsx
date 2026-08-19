import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import apiClient from '../../api/api'

const PatientDetails = () => {
  const { id } = useParams()
  const [patient, setPatient] = useState(null)
  const [consults, setConsults] = useState([])
  const [exams, setExams] = useState([])
  const [consultSortOrder, setConsultSortOrder] = useState('recent')
  const [examSortOrder, setExamSortOrder] = useState('recent')

  const [editingConsult, setEditingConsult] = useState(null)
  const [editConsultData, setEditConsultData] = useState({
    motivo: '',
    data_consulta: '',
    observacoes: '',
    medico_responsavel_id: '',
    paciente_id: '',
  })
  const [isEditingConsult, setIsEditingConsult] = useState(false)

  const [editingExam, setEditingExam] = useState(null)
  const [editExamData, setEditExamData] = useState({
    tipo_exame: '',
    valor: '',
    descricao: '',
    resultado: '',
    data_exame: '',
  })
  const [isEditingExam, setIsEditingExam] = useState(false)

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const patientRes = await apiClient.get(`/pacientes/${id}`)
        const consultsRes = await apiClient.get('/consultas')
        const examsRes = await apiClient.get('/exames')

        setPatient(patientRes.data)
        setConsults((consultsRes.data || []).filter((consulta) => String(consulta.paciente_id) === String(id)))
        setExams((examsRes.data?.exames || examsRes.data || []).filter((exame) => String(exame.paciente_id) === String(id)))
      } catch (error) {
        console.error('Erro ao obter os detalhes do paciente:', error)
      }
    }

    fetchPatientDetails()
  }, [id])

  const sortByDate = (items, field, order) => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a[field])
      const dateB = new Date(b[field])

      return order === 'recent' ? dateB - dateA : dateA - dateB
    })
  }

  const sortedConsults = sortByDate(consults, 'data_consulta', consultSortOrder)
  const sortedExams = sortByDate(exams, 'data_exame', examSortOrder)

  const handleEditConsult = (consult) => {
    setEditingConsult(consult)
    setEditConsultData({
      motivo: consult.motivo || '',
      data_consulta: consult.data_consulta || '',
      observacoes: consult.observacoes || '',
      medico_responsavel_id: consult.medico_responsavel_id || '',
      paciente_id: consult.paciente_id || id,
    })
    setIsEditingConsult(true)
  }

  const handleUpdateConsult = async (e) => {
    e.preventDefault()
    try {
      if (!editingConsult) return

      const updatedConsult = {
        ...editConsultData,
        medico_responsavel_id: Number(editConsultData.medico_responsavel_id),
        paciente_id: Number(editConsultData.paciente_id),
      }

      await apiClient.put(`/consultas/${editingConsult.id}`, updatedConsult)
      setConsults((prev) =>
        prev.map((c) => (c.id === editingConsult.id ? { ...c, ...updatedConsult } : c))
      )

      toast.success('Consulta atualizada com sucesso!')
      setIsEditingConsult(false)
      setEditingConsult(null)
    } catch {
      toast.error('Erro ao atualizar a consulta!')
    }
  }

  const handleDeleteConsult = async (consultId) => {
    try {
      await apiClient.delete(`/consultas/${consultId}`)
      setConsults((prev) => prev.filter((c) => c.id !== consultId))
      toast.success('Consulta excluida com sucesso!')
    } catch {
      toast.error('Erro ao excluir consulta!')
    }
  }

  const handleEditExam = (exam) => {
    setEditingExam(exam)
    setEditExamData({
      tipo_exame: exam.tipo_exame || '',
      valor: exam.valor || '',
      descricao: exam.descricao || '',
      resultado: exam.resultado || '',
      data_exame: exam.data_exame || '',
    })
    setIsEditingExam(true)
  }

  const handleUpdateExam = async (e) => {
    e.preventDefault()
    try {
      if (!editingExam) return

      const updatedExam = {
        ...editExamData,
        valor: Number(editExamData.valor),
      }

      await apiClient.put(`/exames/${editingExam.id}`, updatedExam)
      setExams((prev) =>
        prev.map((exam) => (exam.id === editingExam.id ? { ...exam, ...updatedExam } : exam))
      )

      toast.success('Exame atualizado com sucesso!')
      setIsEditingExam(false)
      setEditingExam(null)
    } catch {
      toast.error('Erro ao atualizar o exame!')
    }
  }

  const handleDeleteExam = async (examId) => {
    try {
      await apiClient.delete(`/exames/${examId}`)
      setExams((prev) => prev.filter((e) => e.id !== examId))
      toast.success('Exame excluido com sucesso!')
    } catch {
      toast.error('Erro ao excluir o exame!')
    }
  }

  if (!patient) return <p>Carregando...</p>

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{patient.nome}</h2>
        <p><span className="font-semibold">Email:</span> {patient.email}</p>
        <p><span className="font-semibold">Telefone:</span> {patient.telefone}</p>
        <p><span className="font-semibold">Sexo:</span> {patient.sexo}</p>
        <p><span className="font-semibold">Convenio:</span> {patient.convenio || "-"}</p>
        <p><span className="font-semibold">Alergias:</span> {patient.alergias || "-"}</p>
        <p><span className="font-semibold">Anotacoes rapidas:</span> {patient.observacoes || "-"}</p>
        <p><span className="font-semibold">Responsavel:</span> {patient.responsavel || "-"}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-700">Historico de consultas</h3>
          <select
            value={consultSortOrder}
            onChange={(e) => setConsultSortOrder(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="recent">Mais recentes primeiro</option>
            <option value="oldest">Mais antigos primeiro</option>
          </select>
        </div>

        {isEditingConsult ? (
          <form onSubmit={handleUpdateConsult} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
              <input
                type="text"
                value={editConsultData.motivo}
                onChange={(e) => setEditConsultData({ ...editConsultData, motivo: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data da consulta</label>
              <input
                type="datetime-local"
                value={editConsultData.data_consulta}
                onChange={(e) => setEditConsultData({ ...editConsultData, data_consulta: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID do medico responsavel</label>
              <input
                type="number"
                value={editConsultData.medico_responsavel_id}
                onChange={(e) => setEditConsultData({ ...editConsultData, medico_responsavel_id: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observacoes</label>
              <textarea
                value={editConsultData.observacoes}
                onChange={(e) => setEditConsultData({ ...editConsultData, observacoes: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                rows="3"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
                Salvar
              </button>
              <button type="button" onClick={() => setIsEditingConsult(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition">
                Cancelar
              </button>
            </div>
          </form>
        ) : sortedConsults.length === 0 ? (
          <p className="text-gray-500">Nenhuma consulta encontrada.</p>
        ) : (
          sortedConsults.map((c) => (
            <div key={c.id} className="border rounded-xl p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition">
              <p><strong>Motivo:</strong> {c.motivo}</p>
              <p><strong>Data:</strong> {c.data_consulta}</p>
              <p><strong>Observacoes:</strong> {c.observacoes}</p>
              <p><strong>ID do medico responsavel:</strong> {c.medico_responsavel_id}</p>
              <div className="flex gap-3 mt-3">
                <button onClick={() => handleEditConsult(c)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                  Editar
                </button>
                <button onClick={() => handleDeleteConsult(c.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">
                  Deletar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-700">Historico de exames</h3>
          <select
            value={examSortOrder}
            onChange={(e) => setExamSortOrder(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="recent">Mais recentes primeiro</option>
            <option value="oldest">Mais antigos primeiro</option>
          </select>
        </div>

        {isEditingExam ? (
          <form onSubmit={handleUpdateExam} className="space-y-4">
            {Object.keys(editExamData).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key.replaceAll('_', ' ')}
                </label>
                {key === 'descricao' || key === 'resultado' ? (
                  <textarea
                    value={editExamData[key]}
                    onChange={(e) => setEditExamData({ ...editExamData, [key]: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    rows="3"
                    required
                  />
                ) : (
                  <input
                    type={key === 'data_exame' ? 'datetime-local' : key === 'valor' ? 'number' : 'text'}
                    value={editExamData[key]}
                    onChange={(e) => setEditExamData({ ...editExamData, [key]: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
                Salvar
              </button>
              <button type="button" onClick={() => setIsEditingExam(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition">
                Cancelar
              </button>
            </div>
          </form>
        ) : sortedExams.length === 0 ? (
          <p className="text-gray-500">Nenhum exame encontrado.</p>
        ) : (
          sortedExams.map((exam) => (
            <div key={exam.id} className="border rounded-xl p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition">
              <p><strong>Tipo:</strong> {exam.tipo_exame}</p>
              <p><strong>Data:</strong> {exam.data_exame}</p>
              <p><strong>Valor:</strong> {exam.valor}</p>
              <p><strong>Descricao:</strong> {exam.descricao}</p>
              <p><strong>Resultado:</strong> {exam.resultado}</p>
              <div className="flex gap-3 mt-3">
                <button onClick={() => handleEditExam(exam)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                  Editar
                </button>
                <button onClick={() => handleDeleteExam(exam.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">
                  Deletar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </section>
  )
}

export default PatientDetails
