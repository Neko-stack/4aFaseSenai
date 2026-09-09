import { useState, useEffect } from 'react'
import { FaHospitalUser } from 'react-icons/fa'
import apiClient from '../../../api/api'

const PatientsCounter = () => {
    const [patientCounter, setPatientCounter] = useState(0)

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await apiClient.get('/pacientes')
                setPatientCounter(response.data.length)
            } catch (error) {
                console.error("Erro ao obter dados dos pacientes", error)
            }
        }
        fetchPatients()
    }, [])

    return (
        <div className='bg-white shadow rounded-lg p-6 flex flex-col items-center w-60'>
            <h2 className='text-xl font-bold flex items-center gap-2'>
                <FaHospitalUser className='text-blue-600' />{patientCounter}
            </h2>
            <p className='text-gray-600 mt-2'>Pacientes</p>
        </div>
    )
}

export default PatientsCounter
