import React, { useState } from 'react'
import AvatarComponent from './components/AvatarComponent'
import Details from './components/Details'
import BillingDetails from './components/BillingDetails'
import { useAccessibility } from '../../../context/AccessibilityContext'

const ProfileUser = () => {

  const {config,setConfig} = useAccessibility();
  const [activeTab, setActiveTab] = useState('informacion');

  return (
    <>
      <div className={
        `flex flex-col min-h-120 min-w-full items-center justify-start
        ${config.highContrast ?'bg-white-to-black' : 'bg-linear-180 from-slate-200 to-indigo-500' }
        `}>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 mb-4">
          <button 
            className={`px-4 py-2 rounded font-Bitcount text-xl transition-all ${activeTab === 'informacion' ? 'bg-indigo-700 text-white shadow-lg scale-105' : 'bg-white text-indigo-700 border-2 border-indigo-700 hover:bg-indigo-50'}`}
            onClick={() => setActiveTab('informacion')}
          >
            Información
          </button>
          <button 
            className={`px-4 py-2 rounded font-Bitcount text-xl transition-all ${activeTab === 'facturacion' ? 'bg-indigo-700 text-white shadow-lg scale-105' : 'bg-white text-indigo-700 border-2 border-indigo-700 hover:bg-indigo-50'}`}
            onClick={() => setActiveTab('facturacion')}
          >
            Facturación
          </button>
          <button 
            className={`px-4 py-2 rounded font-Bitcount text-xl transition-all ${activeTab === 'historial' ? 'bg-indigo-700 text-white shadow-lg scale-105' : 'bg-white text-indigo-700 border-2 border-indigo-700 hover:bg-indigo-50'}`}
            onClick={() => setActiveTab('historial')}
          >
            Historial de eventos
          </button>
        </div>

        <div className="flex flex-wrap w-full items-start justify-center pb-8">
          <AvatarComponent/>
          {activeTab === 'informacion' && <Details/>}
          {activeTab === 'facturacion' && <BillingDetails/>}
          {activeTab === 'historial' && (
             <div className="lg:w-1/2 sm:w-1/3 m-5 p-5 bg-slate-50 rounded-2xl text-center shadow">
                 <p className="text-xl text-gray-500 font-Bitcount">Historial de eventos (Próximamente)</p>
             </div>
          )}
        </div>
        
      </div>
    </>
  )
}

export default ProfileUser