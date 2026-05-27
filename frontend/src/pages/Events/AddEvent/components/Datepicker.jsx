import { useField } from 'formik'
import React from 'react'

const Datepicker = ({label,...props}) => {

    const[field,meta,helpers] = useField(props)

    const handleChange = (e) => {
        let value = e.target.value
        helpers.setValue(value)
    }

  return (
    <div className='flex flex-col items-center m-2 px-1'>
            <label className='italic text-sm'>{label}</label>
            <input
                {...props}
                type="date"
                value={field.value}
                onChange={handleChange}
                onBlur={()=>helpers.setTouched(true)}
                className=" p-2 bg-white text-black border-2 rounded border-indigo-to-yellow"
            />
    </div>
  )
}

export default Datepicker