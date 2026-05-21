import React from 'react'
import { INTERESTS_CONFIG } from '../../../../constant/interestsConfig'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(fas, far)

const StaticInterest = ({ interestName }) => {

    const interest = INTERESTS_CONFIG[interestName] || INTERESTS_CONFIG["OTROS"];
    const { label, icon } = interest;



    return (
        <>
            <div className='flex flex-col items-center'>

                <div className='bg-indigo-to-yellow text-white-to-black p-3 items-center rounded-full'>
                    {/* Icono */}
                    <div className='w-5 h-5 flex items-center content-center'>
                        <FontAwesomeIcon icon={icon} />
                    </div>
                </div>

                <p className='text-center font-Bitcount text-indigo-to-yellow'>{label}</p>
            </div>
        </>
    )
}

export default StaticInterest