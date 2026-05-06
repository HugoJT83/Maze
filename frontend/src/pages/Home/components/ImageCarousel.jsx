import React, { useEffect, useState } from 'react'

const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className='w-full max-w-2xl mx-auto overflow-hidden rounded-lg relative m-4'>
            <div
                className='flex transition-transform duration-300 ease-in-out'
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

export default ImageCarousel