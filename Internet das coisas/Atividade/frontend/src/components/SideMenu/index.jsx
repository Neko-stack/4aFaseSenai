import { Link, useNavigate, NavLink } from 'react-router'
import {
    MdDashboard,
    MdExitToApp,
    MdMenu,
    MdClose
} from 'react-icons/md'

import {
    FaUserPlus,
    FaListAlt,
    FaCalendarCheck
} from 'react-icons/fa'

import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'



const SideMenu = () => {
    const navigate = useNavigate()

    const { logout } = useAuth()

    // controle do menu sanfonado
    const [isCollapsed, setIsCollapsed] = useState(false)

    // função do logout
    const handleLogout = () => {
        logout()
        navigate('/')
    }

    //função toggle menu

    const toggleMenu = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <aside
            className={`h-screen bg-cyan-800 text-white flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* topo - botão toggle */}
            <div className='p-4 flex items-center justify-between border-b border-cyan-700'>
                {
                    !isCollapsed && (
                        <h1 className='text-lg font-bold'>Clínica +</h1>
                    )
                }
                <button
                    onClick={toggleMenu}
                    className='text-white hover:text-cyan-300 focus:outline-none'
                >
                    {isCollapsed ? <MdMenu size={24} /> : <MdClose size={24} />}
                </button>
            </div>

            {/* Menu */}
            <nav className='flex-1 p-4 space-y-4 overflow-y-auto'>
                <ul className='space-y-3'>
                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `flex gap-2 hover:text-cyan-300 ${isActive ? "text-cyan-300" : "text-white"
                                }`
                            }
                        >
                            <MdDashboard size={20} />
                            {!isCollapsed && <span>Início</span>}
                        </NavLink>


                    </li>
                    <li>
                        <NavLink
                            to="/prontuarios"
                            className={({ isActive }) =>
                                `flex gap-2 hover:text-cyan-300 ${isActive ? "text-cyan-300" : "text-white"
                                }`
                            }
                        >
                            <FaCalendarCheck size={20} />
                            {!isCollapsed && <span>Prontuários</span>}
                        </NavLink>


                    </li>
                    <li>
                        <NavLink
                            to="/pacientes"
                            className={({ isActive }) =>
                                `flex gap-2 hover:text-cyan-300 ${isActive ? "text-cyan-300" : "text-white"
                                }`
                            }
                        >
                            <FaUserPlus size={20} />
                            {!isCollapsed && <span>Registrar Paciente</span>}
                        </NavLink>

                    </li>
                    <li>
                        <NavLink
                            to="/consultas"
                            className={({ isActive }) =>
                                `flex gap-2 hover:text-cyan-300 ${isActive ? "text-cyan-300" : "text-white"
                                }`
                            }
                        >
                            <MdMenu size={20} />
                            {!isCollapsed && <span>Consultas</span>}
                        </NavLink>


                    </li>
                    <li>
                        <NavLink
                            to="/exames"
                            className={({ isActive }) =>
                                `flex gap-2 hover:text-cyan-300 ${isActive ? "text-cyan-300" : "text-white"
                                }`
                            }
                        >
                            <FaListAlt size={20} />
                            {!isCollapsed && <span>Exames</span>}
                        </NavLink>

                    </li>
                    <li>
                        <NavLink
                            to="/exames-list"
                            className={({ isActive }) =>
                                `flex gap-2 hover:text-cyan-300 ${isActive ? "text-cyan-300" : "text-white"
                                }`
                            }
                        >
                            <FaListAlt size={20} />
                            {!isCollapsed && <span>Lista de exames</span>}
                        </NavLink>

                    </li>
                </ul>
            </nav>
            {/* botao sair */}
            <div className='p-4 border-t border-cyan-700'>
                <button
                    onClick={handleLogout}
                    className='flex items-center gap-3 text-red-300 hover:text-red-500 w-full cursor-pointer'
                >
                    <MdExitToApp size={20} />
                    {!isCollapsed && <span>Sair</span>}

                </button>
            </div>

        </aside >
    )
}

export default SideMenu
