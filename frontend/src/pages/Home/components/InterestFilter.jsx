import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router-dom'
library.add(fas, far)

const InterestFilter = ({ interest, label, interestKey }) => {
    const navigate = useNavigate();

    return (
        <>
            <div
                className='grid grid-cols-1 place-items-center select-none'
                onClick={() => {
                    if (interestKey) {
                        navigate(`/event-search?interests=${interestKey}`);
                    }
                }}
            >
                <div className='flex items-center align-middle shrink-0 justify-center bg-white-to-black w-20 h-20 sm:w-24 sm:h-24 md:w-30 md:h-30 rounded-full hover:cursor-pointer hover:scale-110 transition-all ease-in-out m-2 sm:m-3 shadow-sm'>
                    <FontAwesomeIcon icon={interest} className='text-indigo-to-yellow text-3xl sm:text-4xl md:text-6xl'></FontAwesomeIcon>
                </div>
                <h3 className='text-sm sm:text-base md:text-2xl font-Bitcount text-white-to-black text-center mt-1'>{label}</h3>
            </div>
        </>
    )
}

export default InterestFilter