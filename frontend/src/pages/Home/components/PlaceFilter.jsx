import React, { useEffect, useState } from 'react'
import { GetCity, GetCountries, GetState } from 'react-country-state-city';
import { useNavigate } from 'react-router-dom';

const PlaceFilter = () => {
    const navigate = useNavigate();

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [countryid, setCountryid] = useState(null);

    useEffect(() => {
        GetCountries().then((result) => {
            const spain = result.find((item) => item.iso2 === "ES");
            if (spain) {
                setCountryid(spain.id)
                GetState(spain.id).then((result) => setStates(result))
            }
        })
    }, [])

    const handleStateChange = (e) => {
        const stateId = parseInt(e.target.value);

        if (stateId && countryid) {
            GetCity(countryid, stateId).then((result) => setCities(result))
        }
    }

    return (
        <>
            <div className='grid grid-cols-1 lg:grid-cols-3 items-center gap-3 '>
                <div className=' w-full my-auto'>
                    <select
                        name="province"
                        id="city"
                        className='w-60 h-15 border-2 rounded-2xl p-2 border-indigo-to-yellow hover:cursor-pointer hover:scale-105 transition-all ease-in-out'
                        onChange={handleStateChange}
                    >
                        <option value="">Selecciona una provincia</option>
                        {states.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className=' w-full my-auto'>
                    <select
                        name="city"
                        id="city"
                        className='w-60 h-15 border-2 rounded-2xl p-2 border-indigo-to-yellow hover:cursor-pointer hover:scale-105 transition-all ease-in-out'
                    >
                        <option value="">Selecciona una ciudad</option>
                        {cities.map((item) => (
                            <option key={item.id} value={item.name}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className=' w-full my-auto'>
                    <button className='bg-indigo-to-yellow text-white-to-black p-2 rounded-xl w-60 h-15 hover:cursor-pointer hover:scale-105 transition-all ease-in-out'>
                        Buscar
                    </button>
                </div>

            </div>
        </>
    )
}

export default PlaceFilter