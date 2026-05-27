import { ErrorMessage, useField } from 'formik'
import React from 'react'

const Hourpicker = ({label,...props}) => {

  const [field,meta,helpers] = useField(props)

  const handleChange = (e) => {
    let value = e.target.value

    /* Borra cualquier valor que no sea un numero o el caracter ":"; solo permite 5 valores*/
    value = value.replace(/[^0-9:]/g, '').slice(0, 5)


    helpers.setValue(value)
  }


    return (
      <div className='flex flex-col items-center m-2 px-3 w-40'> 
        <label className='italic text-sm'>{label}</label>
        <input
          type='text'
          {...props}
          value={field.value}
          onChange={handleChange} /* Toma el valor introducido conforme se escribe */
          onBlur={()=>helpers.setTouched(true)} /* necesario para que se muestren los errores en tiempo real */
          placeholder='00:00'
          className='bg-white-to-black text-center w-14 placeholder:text-gray-to-yellow border-indigo-to-yellow border-2 rounded'
        />
      </div>
    )
}

export default Hourpicker