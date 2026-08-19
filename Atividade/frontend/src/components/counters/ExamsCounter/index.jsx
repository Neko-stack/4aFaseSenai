import { useState, useEffect } from 'react'
import { FaCalendarPlus } from 'react-icons/fa'
import apiClient from '../../../api/api'

const ExamsCounter = () => {
    const [examCounter, setExamCounter] = useState(0)

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await apiClient.get('/exames?pagina=1&limite=10')
                setExamCounter(response.data.total)
            } catch (error) {
                console.error("Erro ao obter dados do pacientes", error)
            }
        }
        fetchExams()
    }, [])

    return (
        <div className='bg-white shadow rounded-lg p-6 flex flex-col items-center w-60'>
            <h2 className='text-xl font-bold flex items-center gap-2'>
                <FaCalendarPlus className='text-blue-600' />{examCounter}
            </h2>
            <p className='text-gray-600 mt-2'>Exames</p>
        </div>
    )
}

export default ExamsCounter
