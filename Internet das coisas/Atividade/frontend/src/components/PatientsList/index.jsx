import { useState, useEffect } from "react"
import { FaUserAlt } from "react-icons/fa"
import { Link } from "react-router"
import apiClient from "../../api/api"

const PatientsList = () => {
    const [patients, setPatients] = useState([])
    const [ages, setAges] = useState({})

    const [filters, setFilters] = useState({
        nome: "",
        email: "",
        telefone: "",
        convenio: "",
        alergias: "",
        observacoes: "",
        sexo: "",
    })

    const calcularIdade = (dataNascimento) => {
        if (!dataNascimento) return "-"

        const hoje = new Date()
        const nascimento = new Date(dataNascimento)

        let idade = hoje.getFullYear() - nascimento.getFullYear()
        const diferencaMes = hoje.getMonth() - nascimento.getMonth()

        if (
            diferencaMes < 0 ||
            (diferencaMes === 0 && hoje.getDate() < nascimento.getDate())
        ) {
            idade--
        }

        return idade
    }

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await apiClient.get("/pacientes")
                const patientsData = response.data || []

                const calculatedAges = {}
                patientsData.forEach((patient) => {
                    calculatedAges[patient.id] = calcularIdade(patient.data_nascimento)
                })

                setAges(calculatedAges)
                setPatients(patientsData)
            } catch (error) {
                console.error("Erro ao obter os dados de pacientes", error)
            }
        }

        fetchPatients()
    }, [])

    const handleFilterChange = (event) => {
        const { name, value } = event.target

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const clearFilters = () => {
        setFilters({
            nome: "",
            email: "",
            telefone: "",
            convenio: "",
            alergias: "",
            observacoes: "",
            sexo: "",
        })
    }

    const filteredPatients = patients.filter((patient) => {
        const nameMatch = patient.nome
            ?.toLowerCase()
            .includes(filters.nome.toLowerCase())

        const emailMatch = patient.email
            ?.toLowerCase()
            .includes(filters.email.toLowerCase())

        const phoneMatch = patient.telefone
            ?.toLowerCase()
            .includes(filters.telefone.toLowerCase())

        const convenioMatch = (patient.convenio || "")
            .toLowerCase()
            .includes(filters.convenio.toLowerCase())

        const alergiasMatch = (patient.alergias || "")
            .toLowerCase()
            .includes(filters.alergias.toLowerCase())

        const observacoesMatch = (patient.observacoes || "")
            .toLowerCase()
            .includes(filters.observacoes.toLowerCase())

        const sexoMatch = patient.sexo
            ?.toLowerCase()
            .includes(filters.sexo.toLowerCase())

        return nameMatch && emailMatch && phoneMatch && convenioMatch && alergiasMatch && observacoesMatch && sexoMatch
    })

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 mt-8">
            <h2 className="text-xl font-semibold text-cyan-800 dark:text-cyan-300 mb-4">
                Informacoes rapidas de pacientes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <input
                    type="text"
                    name="nome"
                    value={filters.nome}
                    onChange={handleFilterChange}
                    placeholder="Filtrar por nome"
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600 outline-none"
                />

                <input
                    type="text"
                    name="email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    placeholder="Filtrar por email"
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600 outline-none"
                />

                <input
                    type="text"
                    name="telefone"
                    value={filters.telefone}
                    onChange={handleFilterChange}
                    placeholder="Filtrar por telefone"
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600 outline-none"
                />

                <input
                    type="text"
                    name="sexo"
                    value={filters.sexo}
                    onChange={handleFilterChange}
                    placeholder="Filtrar por sexo"
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600 outline-none"
                />

                <input
                    type="text"
                    name="convenio"
                    value={filters.convenio}
                    onChange={handleFilterChange}
                    placeholder="Filtrar por convenio"
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600 outline-none"
                />

                <input
                    type="text"
                    name="alergias"
                    value={filters.alergias}
                    onChange={handleFilterChange}
                    placeholder="Filtrar por alergias"
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600 outline-none"
                />

                <input
                    type="text"
                    name="observacoes"
                    value={filters.observacoes}
                    onChange={handleFilterChange}
                    placeholder="Filtrar por anotacoes"
                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-600 outline-none"
                />

                <button
                    type="button"
                    onClick={clearFilters}
                    className="bg-gray-200 text-gray-700 rounded-lg px-3 py-2 hover:bg-gray-300 transition"
                >
                    Limpar filtros
                </button>
            </div>

            {filteredPatients.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                        <li
                            key={patient.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between py-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-cyan-100 text-cyan-700 p-3 rounded-full">
                                    <FaUserAlt size={20} />
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                                        {patient.nome}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {patient.email}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {patient.telefone}
                                    </p>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 mt-2 sm:mt-0 text-right">
                                <p>
                                    <strong>Idade:</strong>{" "}
                                    {ages[patient.id] || "-"} anos
                                </p>
                                <p>
                                    <strong>Sexo:</strong>{" "}
                                    {patient.sexo || "-"}
                                </p>
                                <p>
                                    <strong>Convenio:</strong>{" "}
                                    {patient.convenio || "-"}
                                </p>
                                <p>
                                    <strong>Alergias:</strong>{" "}
                                    {patient.alergias || "-"}
                                </p>
                                <p>
                                    <strong>Anotacoes:</strong>{" "}
                                    {patient.observacoes || "-"}
                                </p>
                                <p>
                                    <strong>Responsavel:</strong>{" "}
                                    {patient.responsavel || "-"}
                                </p>

                                <Link
                                    to={`/paciente/${patient.id}`}
                                    className="text-cyan-700 font-semibold hover:underline"
                                >
                                    Ver detalhes
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-center py-6">
                    Nenhum paciente encontrado
                </p>
            )}
        </div>
    )
}

export default PatientsList
