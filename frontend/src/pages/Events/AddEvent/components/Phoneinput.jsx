import { useField } from 'formik'
import React from 'react'
import flag from '../../../../assets/flag.svg'
const Phoneinput = ({...props}) => {

  const [field,meta,helpers] = useField(props)

  const handleChange = (e) => {
    let value = e.target.value
    helpers.setValue(value)
  }

  return (
    <div className='flex'>
      <div className='flex p-1 mx-2'>
        <img src={flag} alt="spanish_flag" className='w-5' />
        <p className='m-1 font-bold'>+34</p>
      </div>
      <input
        {...props}
        type='tel'
        value={field.value}
        onChange={handleChange}
        onBlur={()=>helpers.setTouched(true)}
        placeholder="222 333 444"
        className='p-1 bg-white-to-black rounded border-2 w-full ml-2 border-indigo-to-yellow'
      />
    </div>
  )
}

export default Phoneinput