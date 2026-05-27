import { useField } from 'formik'
import React, { useEffect, useState } from 'react'
import { CitySelect, CountrySelect, GetAllCities, GetCity, GetCountries, GetState, StateSelect } from 'react-country-state-city';

const Locationpicker = ({setFieldValue, values,setFieldTouched}) => {

    /* librería country-state-city */
    const [states,setStates] = useState([])
    const [cities,setCities] = useState([])
    const [countryid, setCountryid] = useState(null)

    /* Obtiene:
        - el ID de España
        - las provincias de España
    */
    useEffect(()=>{
        GetCountries().then((result) => {
            const spain = result.find((item) =>item.iso2 === "ES");
            if (spain) {
                setCountryid(spain.id)
                GetState(spain.id).then((result) => setStates(result))
            }
        })
    }, [])

    /* Realiza:
        - Obtener las ciudades cuando se cambia de provincia
        - Resetear la ciudad cuando se cambia de provincia
     */
    const handleStateChange = (e) => {
        const stateName = e.target.value
        const stateObj = states.find(s => s.name === stateName)

        setFieldValue("location.province",stateName)
        setFieldValue("location.city","")

        if(stateObj){
            GetCity(countryid,stateObj.id).then((result) => setCities(result))
        }
    }

  return (
    <>
        <div className='grid grid-cols-1 md:grid-cols-3 my-3'>
            <div className='my-2 md:my-0'>
                <h1 className='text-sm italic'>Provincia</h1>
                <select
                    name='province'
                    value={values.location?.province || ""}
                    onChange={handleStateChange}
                    onBlur={()=> setFieldTouched('location.province',true)}
                    className='w-40 lg:w-60 bg-white-to-black p-1 border-2 border-indigo-to-yellow rounded'
                >
                    <option value="">Selecciona una Provincia</option>
                    {states.map((item) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                </select>
            </div>
            
            <div className='my-2 md:my-0'>
                <h1 className='text-sm italic'>Ciudad</h1>
                <select
                    name='city'
                    value={values.location?.city || ""}
                    onChange={(e)=> setFieldValue("location.city",e.target.value)}
                    onBlur={()=> setFieldTouched('location.city',true)}
                    disabled={!cities.length}
                    className='w-40 lg:w-60 bg-white-to-black p-1 border-2 border-indigo-to-yellow rounded'
                >
                    <option value="">Selecciona una ciudad</option>
                    {cities.map((item) =>(
                        <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                </select>
            </div>

            <div className='my-2 md:my-0'>
                <h1 className='text-sm italic'>Lugar</h1>
                <input 
                    type="text"
                    value={values.location?.direction || ""}
                    onChange={(e)=>setFieldValue("location.direction",e.target.value)}
                    onBlur={()=>setFieldTouched('location.direction',true)}
                    placeholder='Indique el lugar del evento'
                    className='bg-white-to-black rounded border-2 p-1 border-indigo-to-yellow w-full'
                 />
            </div>
        </div>
        
    </>
  )
}

export default Locationpicker