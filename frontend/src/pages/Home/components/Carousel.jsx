import React, { useEffect, useState } from 'react'

const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className='w-full overflow-hidden rounded-lg'>
            <div
                className='flex transition-transform duration-500 ease-in-out'
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        className='w-full flex object-cover'
                    />
                ))}
            </div>

        </div>
    )
}

export default Carousel