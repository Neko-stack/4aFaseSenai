import React, { useEffect, useState } from 'react'

import { toast } from 'react-toastify'

import { useNavigate } from 'react-router'

// Contexto
import { useAuth } from '../../contexts/AuthContext'

// Modal
import Modal from '../Modal'
import RegisterUser from '../RegisterUser'
import apiClient from '../../api/api'

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [resetEmail, setResetEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [isResettingPassword, setIsResettingPassword] = useState(false)

    const navigate = useNavigate()

    const { login, user } = useAuth()

    // controle do modal

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isResetModalOpen, setIsResetModalOpen] = useState(false)

    // autenticação do usuário (verificação)

    useEffect(() => {
        if (user) {
            navigate('/dashboard')
        }
    }, [user, navigate])

    //validação de login
    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await apiClient.post('/login', {
                email, senha: password
            })

            console.log("response", response)

            // console.log("params", params)

            if (response.data.length === 0) {
                toast.error('Usuário não encontrado. Verifique o email e senha', {
                    autoClose: 3000,
                    hideProgressBar: true
                });
                return;
            }

            localStorage.setItem("accessToken", response?.data?.accessToken)
            localStorage.setItem("refreshToken", response?.data?.refreshToken)

            login(email)

            toast.success('Login realizado com sucesso!', {
                autoClose: 2000
            })

            setTimeout(() => navigate('/dashboard', 2000))

        } catch (error) {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("email")
            console.error('Erro ao verificar usuário', error)
            toast.error('Erro ao conectar com o servidor', {
                autoClose: 3000
            })
        }
    }

    const resetPasswordForm = () => {
        setResetEmail("")
        setNewPassword("")
        setConfirmNewPassword("")
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmNewPassword) {
            toast.error("As senhas nao correspondem", {
                autoClose: 2000,
                hideProgressBar: true
            })
            return
        }

        if (newPassword.length < 8) {
            toast.error("A senha deve ter pelo menos 8 caracteres", {
                autoClose: 2000,
                hideProgressBar: true
            })
            return
        }

        setIsResettingPassword(true)

        try {
            await apiClient.put("/reset-password", {
                email: resetEmail,
                senha: newPassword
            })

            toast.success("Senha alterada com sucesso!", {
                autoClose: 2000,
                hideProgressBar: true
            })

            resetPasswordForm()
            setIsResetModalOpen(false)
        } catch (error) {
            console.error("Erro ao alterar senha", error)
            toast.error(
                error.response?.data?.mensagem || "Erro ao alterar senha",
                {
                    autoClose: 3000,
                    hideProgressBar: true
                }
            )
        } finally {
            setIsResettingPassword(false)
        }
    }



    return (
        <div className='max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg'>
            <h2 className='text-2xl font-bold text-center mb-6'>Login</h2>

            <form onSubmit={handleLogin} className='space-y-4'>
                <fieldset>
                    <label htmlFor='email' className='block text-sm font-medium mb-1'>Email</label>
                    <input
                        type='email'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </fieldset>

                <fieldset>
                    <label htmlFor='password' className='block text-sm font-medium mb-1'>Senha:</label>
                    <input
                        type='password'
                        id='password'
                        // minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </fieldset>

                <button
                    type='submit'
                    className='w-full bg-cyan-700 text-white p-2 rounded-lg hover:bg-cyan-800 transition-colors'>
                    Entrar
                </button>

            </form>

            <div className='flex justify-between mt-4 text-sm'>
                <button onClick={() => setIsResetModalOpen(true)} className='text-blue-600 hover:underline cursor-pointer'>
                    Esqueceu sua senha?
                </button>

                <button onClick={() => setIsModalOpen(true)} className='text-blue-600 hover:underline cursor-pointer'>
                    Criar Conta
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <RegisterUser />
            </Modal>

            <Modal
                isOpen={isResetModalOpen}
                onClose={() => {
                    resetPasswordForm()
                    setIsResetModalOpen(false)
                }}
            >
                <div className='w-full max-w-md p-6 bg-white rounded-xl'>
                    <h2 className='text-2xl font-bold mb-6 text-center'>Redefinir senha</h2>

                    <form onSubmit={handleResetPassword} className='space-y-4'>
                        <fieldset>
                            <label htmlFor='reset-email' className='block text-sm font-medium mb-1'>Email:</label>
                            <input
                                type='email'
                                id='reset-email'
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                                className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </fieldset>

                        <fieldset>
                            <label htmlFor='new-password' className='block text-sm font-medium mb-1'>Nova senha:</label>
                            <input
                                type='password'
                                id='new-password'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                                className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </fieldset>

                        <fieldset>
                            <label htmlFor='confirm-new-password' className='block text-sm font-medium mb-1'>Confirmar nova senha:</label>
                            <input
                                type='password'
                                id='confirm-new-password'
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                                minLength={8}
                                className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </fieldset>

                        <button
                            type='submit'
                            disabled={isResettingPassword}
                            className={`w-full p-2 rounded-lg text-white mt-4 ${isResettingPassword ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                                } transition-colors`}
                        >
                            {isResettingPassword ? "Salvando..." : "Alterar senha"}
                        </button>
                    </form>
                </div>
            </Modal>




        </div>
    )
}

export default LoginForm
