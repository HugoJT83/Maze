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
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            <div className='flex items-center justify-center w-full max-w-full gap-2 sm:gap-5 md:gap-10 lg:gap-20 px-2 sm:px-4'>

                {/* Arrow Left (Desktop only) */}
                <button
                    onClick={() => scroll('left')}
                    className='hidden md:flex items-center align-middle justify-center bg-white-to-black w-12 h-12 shrink-0 rounded-full hover:cursor-pointer hover:scale-110 transition-all ease-in-out dark:border-gray-800'
                    aria-label="Anterior"
                >
                    <FontAwesomeIcon icon={'fa-solid fa-arrow-left'} className='text-2xl text-indigo-to-yellow'></FontAwesomeIcon>
                </button>

                {/* Carousel Container */}
                <div
                    ref={scrollRef}
                    className='flex w-full md:w-150 lg:w-250 gap-8 sm:gap-16 md:gap-32 lg:gap-50 overflow-x-auto md:overflow-hidden px-4 md:px-10 no-scrollbar scroll-smooth snap-x snap-mandatory'
                >
                    {Object.entries(INTERESTS_CONFIG).map(([key, config]) => {
                        return (
                            <div key={key} className="snap-center shrink-0">
                                <InterestFilter
                                    interestKey={key}
                                    interest={config.icon}
                                    label={config.label}
                                />
                            </div>
                        )
                    })}
                </div>

                {/* Arrow Right (Desktop only) */}
                <button
                    onClick={() => scroll('right')}
                    className='hidden md:flex items-center align-middle justify-center bg-white-to-black w-12 h-12 shrink-0 rounded-full hover:cursor-pointer hover:scale-110 transition-all ease-in-out dark:border-gray-800'
                    aria-label="Siguiente"
                >
                    <FontAwesomeIcon icon={'fa-solid fa-arrow-right'} className='text-2xl text-indigo-to-yellow'></FontAwesomeIcon>
                </button>
            </div>
        </>
    )
}

export default InterestCarousel