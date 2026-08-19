import React, { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import apiClient from "../../api/api"
import Modal from "../Modal"

const ExamsForm = () => {
    const [patients, setPatients] = useState([])
    const [filteredPatients, setFilteredPatients] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [examData, setExamData] = useState({
        tipo_exame: "",
        valor: "",
        descricao: "",
        resultado: "",
        data_exame: "",
    })
    const [isSaving, setIsSaving] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await apiClient.get("/pacientes")
                setPatients(response.data || [])
                setFilteredPatients(response.data || [])
            } catch (error) {
                console.error("Erro ao obter dados dos pacientes:", error)
            }
        }

        fetchPatients()
    }, [])

    const handleSearchChange = (event) => {
        const searchTerm = event.target.value.toLowerCase()
        const filtered = patients.filter(
            (patient) =>
                patient.nome?.toLowerCase().includes(searchTerm) ||
                patient.id.toString().includes(searchTerm)
        )
        setFilteredPatients(filtered)
    }

    const handleSelectModal = (patient) => {
        setSelectedPatient(patient)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setSelectedPatient(null)
        setIsModalOpen(false)
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setExamData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const resetForm = () => {
        setExamData({
            tipo_exame: "",
            valor: "",
            descricao: "",
            resultado: "",
            data_exame: "",
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!selectedPatient) return

        try {
            setIsSaving(true)

            await apiClient.post("/exames", {
                ...examData,
                valor: Number(examData.valor),
                paciente_id: selectedPatient.id,
            })

            toast.success("Exame cadastrado com sucesso!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
            })

            resetForm()
            handleCloseModal()
        } catch (error) {
            toast.error("Erro ao cadastrar o exame!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
            })
            console.error("Erro ao cadastrar exame:", error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <section className="p-6 text-gray-800">
            <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                    Buscar paciente para cadastrar exame
                </label>
                <input
                    type="text"
                    onChange={handleSearchChange}
                    placeholder="Digite o nome ou registro do paciente"
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                />
            </div>

            <ul className="space-y-3">
                {filteredPatients.map((patient) => (
                    <li
                        key={patient.id}
                        className="p-4 border rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-50 transition"
                    >
                        <div>
                            <p className="text-sm">
                                <strong>Registro:</strong> {patient.id}
                            </p>
                            <p className="text-sm">
                                <strong>Nome:</strong> {patient.nome}
                            </p>
                            <p className="text-sm">
                                <strong>Telefone:</strong> {patient.telefone || "-"}
                            </p>
                        </div>
                        <button
                            onClick={() => handleSelectModal(patient)}
                            className="bg-cyan-700 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-600 transition"
                        >
                            Selecionar
                        </button>
                    </li>
                ))}
            </ul>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {selectedPatient && (
                    <>
                        <h2 className="text-lg font-bold mb-4 text-cyan-700">
                            Cadastrar exame para {selectedPatient.nome}
                        </h2>

                        <div className="mb-4 text-sm text-gray-700">
                            <p>
                                <strong>Email:</strong> {selectedPatient.email}
                            </p>
                            <p>
                                <strong>Telefone:</strong> {selectedPatient.telefone}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Tipo do exame
                                </label>
                                <input
                                    type="text"
                                    name="tipo_exame"
                                    value={examData.tipo_exame}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Valor
                                </label>
                                <input
                                    type="number"
                                    name="valor"
                                    value={examData.valor}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Data do exame
                                </label>
                                <input
                                    type="datetime-local"
                                    name="data_exame"
                                    value={examData.data_exame}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Descricao
                                </label>
                                <textarea
                                    name="descricao"
                                    value={examData.descricao}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Resultado
                                </label>
                                <textarea
                                    name="resultado"
                                    value={examData.resultado}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 transition"
                                >
                                    {isSaving ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </Modal>

            <ToastContainer />
        </section>
    )
}

export default ExamsForm
