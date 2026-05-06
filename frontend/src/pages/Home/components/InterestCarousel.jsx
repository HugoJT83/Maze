import React, { useRef } from 'react'

import { INTERESTS_CONFIG } from '../../../constant/interestsConfig'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import InterestFilter from './InterestFilter'
library.add(fas, far)

const InterestCarousel = () => {

    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - 1000
                : scrollLeft + 1000;

            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };


    return (
        <>
            <div className='flex items-center gap-5 lg:gap-20'>
                <button
                    onClick={() => scroll('left')}
                    className='flex items-center align-middle justify-center bg-white-to-black w-10 h-10  rounded-full hover:cursor-pointer hover:scale-110 transition-all ease-in-out  '
                >
                    <FontAwesomeIcon icon={'fa-solid fa-arrow-left'} className='text-3xl text-indigo-to-yellow'></FontAwesomeIcon>
                </button>
                <div
                    ref={scrollRef}
                    className='flex md:w-150  lg:w-250  gap-50 overflow-hidden px-20'>

                    {Object.entries(INTERESTS_CONFIG).map(([key, config]) => {

                        return (
                            <InterestFilter
                                key={key}
                                interest={config.icon}
                                label={config.label}
                            />
                        )
                    })}

                </div>
                <button
                    onClick={() => scroll('right')}
                    className=' flex items-center align-middle justify-center bg-white-to-black w-10 h-10 rounded-full hover:cursor-pointer hover:scale-110 transition-all ease-in-out'
                >
                    <FontAwesomeIcon icon={'fa-solid fa-arrow-right'} className='text-3xl text-indigo-to-yellow'></FontAwesomeIcon>
                </button>
            </div>
        </>
    )
}

export default InterestCarousel