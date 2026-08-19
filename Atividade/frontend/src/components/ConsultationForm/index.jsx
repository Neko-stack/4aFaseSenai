import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import apiClient from '../../api/api'
import Modal from '../Modal'

function ConsultationForm() {
    const [searchTerm, setSearchTerm] = useState("")
    const [patients, setPatients] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        motivo: "",
        data_consulta: "",
        observacoes: "",
        medico_responsavel_id: "",
    })

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await apiClient.get("/pacientes")
                setPatients(response.data || [])
            } catch (error) {
                console.error("Erro ao obter dados dos pacientes", error)
            }
        }

        fetchPatients()
    }, [])

    const filteredPatients = patients.filter(
        (patient) =>
            patient.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toString().includes(searchTerm)
    )

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedPatient(null)
    }

    const resetForm = () => {
        setFormData({
            motivo: "",
            data_consulta: "",
            observacoes: "",
            medico_responsavel_id: "",
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedPatient) return

        try {
            setIsSaving(true)

            await apiClient.post("/consultas", {
                motivo: formData.motivo,
                data_consulta: formData.data_consulta,
                observacoes: formData.observacoes,
                medico_responsavel_id: Number(formData.medico_responsavel_id),
                paciente_id: selectedPatient.id,
            })

            toast.success("Consulta cadastrada com sucesso!", {
                autoClose: 2000,
                hideProgressBar: true
            })

            resetForm()
            handleCloseModal()
        } catch (error) {
            console.error("Erro ao cadastrar consulta!", error)
            toast.error("Erro ao cadastrar consulta!", {
                autoClose: 2000,
                hideProgressBar: true
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <section className='p-6 text-gray-800'>
            <div className='mb-6'>
                <label className='block text-sm font-semibold mb-2'>
                    Buscar paciente para cadastrar a consulta
                </label>
                <input
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder='Digite o nome ou o registro do paciente'
                    className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                />
            </div>

            <ul className='space-y-3'>
                {filteredPatients.map((patient) => (
                    <li
                        key={patient.id}
                        className='p-4 border rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-50 transition'
                    >
                        <div>
                            <p className='text-sm'><strong>Registro:</strong> {patient.id}</p>
                            <p className='text-sm'><strong>Nome:</strong> {patient.nome}</p>
                            <p className='text-sm'><strong>Telefone:</strong> {patient.telefone || "-"}</p>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedPatient(patient)
                                setIsModalOpen(true)
                            }}
                            className='bg-cyan-700 text-white px-3 py-2 rounded-lg hover:bg-cyan-600 cursor-pointer'
                        >
                            Selecionar
                        </button>
                    </li>
                ))}
            </ul>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {selectedPatient && (
                    <>
                        <h2 className='text-lg font-bold mb-4 text-cyan-700'>
                            Cadastrar consulta para {selectedPatient.nome}
                        </h2>

                        <div className='mb-4 text-sm text-gray-700'>
                            <p><strong>Email:</strong> {selectedPatient.email}</p>
                            <p><strong>Telefone:</strong> {selectedPatient.telefone}</p>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div>
                                <label htmlFor='motivo' className='block text-sm font-medium mb-1'>
                                    Motivo da consulta
                                </label>
                                <input
                                    type='text'
                                    name='motivo'
                                    id='motivo'
                                    value={formData.motivo}
                                    onChange={handleInputChange}
                                    required
                                    className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                                />
                            </div>

                            <div>
                                <label htmlFor='data_consulta' className='block text-sm font-medium mb-1'>
                                    Data da consulta
                                </label>
                                <input
                                    type='datetime-local'
                                    name='data_consulta'
                                    id='data_consulta'
                                    value={formData.data_consulta}
                                    onChange={handleInputChange}
                                    required
                                    className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                                />
                            </div>

                            <div>
                                <label htmlFor='medico_responsavel_id' className='block text-sm font-medium mb-1'>
                                    ID do medico responsavel
                                </label>
                                <input
                                    type='number'
                                    name='medico_responsavel_id'
                                    id='medico_responsavel_id'
                                    value={formData.medico_responsavel_id}
                                    onChange={handleInputChange}
                                    required
                                    className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                                />
                            </div>

                            <div>
                                <label htmlFor='observacoes' className='block text-sm font-medium mb-1'>
                                    Observacoes
                                </label>
                                <textarea
                                    name='observacoes'
                                    id='observacoes'
                                    value={formData.observacoes}
                                    rows={3}
                                    onChange={handleInputChange}
                                    required
                                    className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none resize-none'
                                />
                            </div>

                            <div className='flex justify-end gap-3 pt-4'>
                                <button
                                    type='button'
                                    onClick={handleCloseModal}
                                    className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition'
                                >
                                    Fechar
                                </button>

                                <button
                                    type='submit'
                                    disabled={isSaving}
                                    className='px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 transition'
                                >
                                    {isSaving ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </Modal>
        </section>
    )
}

export default ConsultationForm
