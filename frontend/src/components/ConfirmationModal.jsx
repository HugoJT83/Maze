import React from 'react'

const ConfirmationModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white-to-black/60 backdrop-blur-sm">
                {/* Contenedor del Modal con tu línea de diseño */}
                <div className="bg-white border-2 border-lightgray-to-yellow p-6 rounded-xl max-w-md w-full mx-4 shadow-xl animate-fade-in">

                    <h3 className="text-xl font-bold text-indigo-to-yellow mb-2">
                        ¿Confirmar eliminación?
                    </h3>

                    <p className="text-sm text-gray-600  mb-6 leading-relaxed">
                        ¿Estás completamente seguro de que deseas eliminar este evento? Esta acción es permanente y no se podrá deshacer.
                    </p>

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100  hover:bg-gray-200  rounded-lg transition-colors cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                        >
                            {isDeleting ? "Eliminando..." : "Sí, eliminar"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConfirmationModal