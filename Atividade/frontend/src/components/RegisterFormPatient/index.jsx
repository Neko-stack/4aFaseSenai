import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { IMaskInput } from 'react-imask'
import apiClient from '../../api/api'

function RegisterFormPatient() {
    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        data_nascimento: "",
        sexo: "",
        convenio: "",
        alergias: "",
        observacoes: "",
        responsavel: "",
    })

    const [isSaving, setIsSaving] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const resetForm = () => {
        setFormData({
            nome: "",
            cpf: "",
            telefone: "",
            email: "",
            data_nascimento: "",
            sexo: "",
            convenio: "",
            alergias: "",
            observacoes: "",
            responsavel: "",
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            await apiClient.post("/pacientes", {
                ...formData,
            
            })

            toast.success("Paciente cadastrado com sucesso!", {
                autoClose: 2000,
                hideProgressBar: true
            })

            resetForm()
        } catch (error) {
            console.error(error)
            toast.error("Erro ao salvar os dados!", {
                autoClose: 2000,
                hideProgressBar: true
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className='space-y-6 text-gray-800'
            autoComplete='off'
        >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <fieldset>
                    <label htmlFor='nome' className='block text-sm font-medium mb-1'>Nome</label>
                    <input
                        type='text'
                        name='nome'
                        id='nome'
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>

                <fieldset>
                    <label htmlFor='cpf' className='block text-sm font-medium mb-1'>CPF</label>
                    <IMaskInput
                        mask="000.000.000-00"
                        name='cpf'
                        id='cpf'
                        value={formData.cpf}
                        onAccept={(value) => setFormData((prev) => ({ ...prev, cpf: value }))}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>

                <fieldset>
                    <label htmlFor='telefone' className='block text-sm font-medium mb-1'>Telefone</label>
                    <IMaskInput
                        mask="(00) 00000-0000"
                        name='telefone'
                        id='telefone'
                        value={formData.telefone}
                        onAccept={(value) => setFormData((prev) => ({ ...prev, telefone: value }))}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>

                <fieldset>
                    <label htmlFor='email' className='block text-sm font-medium mb-1'>Email</label>
                    <input
                        type='email'
                        name='email'
                        id='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>

                <fieldset>
                    <label htmlFor='data_nascimento' className='block text-sm font-medium mb-1'>Data de nascimento</label>
                    <input
                        type='date'
                        name='data_nascimento'
                        id='data_nascimento'
                        value={formData.data_nascimento}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>

                <fieldset>
                    <label htmlFor='sexo' className='block text-sm font-medium mb-1'>Sexo</label>
                    <select
                        name='sexo'
                        id='sexo'
                        value={formData.sexo}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    >
                        <option value="">Selecione</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                    </select>
                </fieldset>

                <fieldset className='md:col-span-2'>
                    <label htmlFor='convenio' className='block text-sm font-medium mb-1'>Convenio</label>
                    <input
                        type='text'
                        name='convenio'
                        id='convenio'
                        value={formData.convenio}
                        onChange={handleInputChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>

                <fieldset className='md:col-span-2'>
                    <label htmlFor='alergias' className='block text-sm font-medium mb-1'>Alergias</label>
                    <input
                        type='text'
                        name='alergias'
                        id='alergias'
                        value={formData.alergias}
                        onChange={handleInputChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>

                <fieldset className='md:col-span-2'>
                    <label htmlFor='observacoes' className='block text-sm font-medium mb-1'>Anotacoes rapidas</label>
                    <textarea
                        name='observacoes'
                        id='observacoes'
                        value={formData.observacoes}
                        onChange={handleInputChange}
                        placeholder='Ex: Paciente prefere contato por WhatsApp, retornar em 30 dias'
                        rows={3}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none resize-none'
                    />
                </fieldset>

                <fieldset className='md:col-span-2'>
                    <label htmlFor='responsavel' className='block text-sm font-medium mb-1'>Responsavel</label>
                    <input
                        type='text'
                        name='responsavel'
                        id='responsavel'
                        value={formData.responsavel}
                        onChange={handleInputChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>
            </div>

            <div className='flex justify-end gap-3 pt-4'>
                <button
                    type='submit'
                    disabled={isSaving}
                    className='px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50'
                >
                    {isSaving ? "Salvando..." : "Salvar"}
                </button>
            </div>
        </form>
    )
}

export default RegisterFormPatient
