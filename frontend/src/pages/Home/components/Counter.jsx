import React, { useEffect, useRef, useState } from 'react'

const Counter = ({ targetCounter, text }) => {

    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [])

    useEffect(() => {

        if (!isVisible) return;

        let start = 0;

        const duration = 2000;

        const increment = targetCounter / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= targetCounter) {
                setCount(targetCounter);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }

        }, 16);

        return () => clearInterval(timer);

    }, [targetCounter, isVisible]);

    return (
        <div ref={containerRef} className='flex flex-col justify-center text-center text-4xl text-black'>
            <p className='font-bold'>+<span>{count.toString()}</span></p>
            <p>{text}</p>
        </div>
    )
}

export default Counter