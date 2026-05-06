import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(fas, far)

const InterestFilter = ({ interest, label }) => {
    return (
        <>
            <div className='grid grid-cols-1 place-items-center'>
                <div className='flex items-center align-middle shrink-0 justify-center bg-white-to-black w-30 h-30 rounded-full hover:cursor-pointer hover:scale-110 transition-all ease-in-out m-3'>
                    <FontAwesomeIcon icon={interest} className='text-indigo-to-yellow text-6xl    '></FontAwesomeIcon>
                </div>
                <h3 className='text-2xl font-Bitcount text-white-to-black'>{label}</h3>
            </div>
        </>
    )
}

export default InterestFilter