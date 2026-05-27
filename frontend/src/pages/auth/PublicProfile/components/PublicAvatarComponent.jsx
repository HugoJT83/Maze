import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(fas, far)

import samplePhoto from "../../../../assets/profile_photo.png"

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import { axiosClient } from '../../../../utils/axiosClient'
import { useAuthContext } from '../../../../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'

const PublicAvatarComponent = ({ avatar }) => {

    return (
        <div className='relative w-55 h-55 text-center rounded-full m-10'>
            <img src={avatar ?? samplePhoto} alt="profile_photo" className='rounded-full w-full h-full object-cover ' />
        </div>
    )
}

export default PublicAvatarComponent