import React, { useEffect, useState } from 'react'
import { GetCity, GetCountries, GetState } from 'react-country-state-city'

const LocationSelect = ({setFieldValue, values, setFieldTouched,editingId}) => {
    /* librería country-state-city */
    const [states,setStates] = useState([])
    const [cities,setCities] = useState([])
    const [countryid, setCountryid] = useState(null)
    
    useEffect(()=>{
        GetCountries().then((result) => {
            const spain = result.find((item) =>item.iso2 === "ES");
            if (spain) {
                setCountryid(spain.id)
                GetState(spain.id).then((result) => setStates(result))
            }
        })
    }, [])

    /* Si ya hay una provincia, toma esa provincia y carga las ciudades */
    useEffect(() => {
        if (countryid && values.address?.province && states.length > 0) {
            const stateObj = states.find(s => s.name === values.address.province);
            if (stateObj) {
                GetCity(countryid, stateObj.id).then((result) => setCities(result));
            }
        }
    }, [countryid, states, values.address?.province]);
  
    /* Realiza:
        - Obtener las ciudades cuando se cambia de provincia
        - Resetear la ciudad cuando se cambia de provincia
    */
    const handleStateChange = (e) => {
        const stateName = e.target.value
        const stateObj = states.find(s => s.name === stateName)

        setFieldValue("address.province",stateName)
        setFieldValue("address.city","")
        setFieldTouched("address",true)

        if(stateObj){
            GetCity(countryid,stateObj.id).then((result) => setCities(result))
        }
    }

    if(editingId !== 2) return null;

    return (
    <>
        <div className='flex flex-wrap'>
            {/* provincia */}
            <div>
            <h1 className='text-sm italic'>Provincia</h1>
            <select 
                name="province"
                id="province"
                value={values.address?.province || ""}
                onChange={handleStateChange}
                onBlur={()=>setFieldTouched('address.province',true)}
                className='border-2 rounded-xl p-1 border-indigo-to-black mr-2 max-w-50'
                >
                    <option value="">Selecciona una provincia</option>
                    {states.map((item) =>(
                        <option key = {item.id} value={item.name}>{item.name}</option>
                    ))}
                </select>
            </div>

            {/* Ciudad */}
            <div>
                <h1 className='text-sm italic'>Ciudad</h1>
                <select
                    name='city'
                    id="city"
                    value={values.address?.city || ""}
                    onChange={(e)=> setFieldValue("address.city",e.target.value)}
                    onBlur={()=> setFieldTouched('address.city',true)}
                    disabled={!cities.length}
                    className='border-2 rounded-xl p-1 border-indigo-to-black max-w-50'

                >
                    <option value="">Selecciona una ciudad</option>
                    {cities.map((item) =>(
                        <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                </select>
            </div>

        </div>
    </>
  )
}

export default LocationSelect