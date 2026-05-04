import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(fas,far)

import samplePhoto from "../../../../assets/profile_photo.png"

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import { axiosClient } from '../../../../utils/axiosClient'
import { useAuthContext } from '../../../../context/AuthContext'

const AvatarComponent = () => {

  const {user,fetchUserProfile} = useAuthContext()
  const [loading,setLoading] = useState(false)

    const onDrop = useCallback(async(acceptedFiles)=>{

      if(acceptedFiles && acceptedFiles.length>0){

        try{
          setLoading(true)
          const formData = new FormData();
          formData.append("avatar",acceptedFiles[0])
          
          const response = await axiosClient.put("/auth/update-avatar",formData,{
            headers:{
              'Authorization':'Bearer '+localStorage.getItem('token')
            }
          })
          const data = await response.data
          await fetchUserProfile()
          toast.success(data.msg)
          
        }
        catch(error){
          toast.error(error.response.data.detail || error.message)
        }finally{
          setLoading(false)
        }

      }
    },[])

    const {getRootProps,getInputProps,isDragActive} = useDropzone({onDrop,
      multiple:false,
      accept:{
        'image/jpeg':['.jpeg','.jpg'],
        'image/png':['.png']
      }
    })


  return (
    <div {...getRootProps()} className='relative w-55 h-55 text-center rounded-full m-10'>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <>
            <img src={user?.avatar ?? samplePhoto} alt="profile_photo" className='rounded-full w-full h-full object-cover blur-sm' />
            
          </> :
            <>
              {
                loading ? 
                  <>
                    <FontAwesomeIcon icon="fa-solid fa-compass" className=' m-15 animate-spin text-3xl text-black-to-white'></FontAwesomeIcon>
                  </> :
                    <img src={user?.avatar ?? samplePhoto} alt="profile_photo" className='rounded-full w-full h-full object-cover ' />
              }
            </>
      }
      <button id='btn-profile' type='button' className='w-10 h-10 absolute -right-2 bottom-3 rounded-full bg-indigo-to-yellow shadow-[2px_3px_2px] shadow-black/30 text-white-to-black transition ease-in-out hover:scale-120 hover:cursor-pointer'>
        <FontAwesomeIcon icon={'fa-solid fa-pencil'}></FontAwesomeIcon>
      </button>
    </div>
  )
}

export default AvatarComponent