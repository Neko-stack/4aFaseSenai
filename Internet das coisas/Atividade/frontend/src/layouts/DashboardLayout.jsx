import { Outlet } from "react-router"
import { useAuth } from "../contexts/AuthContext"
import SideMenu from "../components/SideMenu"
import { MdDarkMode, MdLightMode } from "react-icons/md"
import { useTheme } from "../contexts/ThemeContext"


const DashboardLayout = () => {
    const { user, logout } = useAuth()
    const { darkMode, toggleTheme } = useTheme()

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-black">
            {/* barra lateral - menu */}

            <SideMenu />

            {/* Conteúdo principal */}
            <main className="flex-1 flex flex-col">
                <header className="flex justify-between items-center bg-white dark:bg-black border-b border-transparent dark:border-white p-4 shadow">
                    <h1 className="text-xl font-bold text-cyan-800 dark:text-white">Painel do Sistema</h1>                    {
                        user && (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center gap-2 border border-cyan-700 dark:border-white px-3 py-1 rounded text-cyan-800 dark:text-white hover:bg-cyan-700 hover:text-white dark:hover:bg-black dark:hover:text-white transition cursor-pointer"
                                >
                                    {darkMode ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
                                    <span>{darkMode ? "Claro" : "Escuro"}</span>
                                </button>
                                <span className="text-gray-700 dark:text-white">Bem Vindo, {user.email}</span>
                                <button
                                    onClick={logout}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                                >
                                    Sair

                                </button>

                            </div>
                        )
                    }
                </header>

                {/* Páginas internas do dashboard */}
                <section className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </section>
            </main>
        </div>
    )
}

export default DashboardLayout
