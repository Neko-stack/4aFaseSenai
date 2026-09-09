import React from 'react'

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
            <div className='modal-panel w-full max-w-md p-6 relative'>
                {/* botão de fechar */}
                <button
                    onClick={onClose}
                    className='absolute top-3 right-3 text-gray-500 dark:text-white hover:text-gray-700 dark:hover:text-cyan-300 font-bold text-lg cursor-pointer'
                >
                    x
                </button>

                {children}
            </div>
        </div>
    )
}

export default Modal
