import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const eventSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [progress, setProgress] = useState(100);

    const fromCreation = location.state?.fromCreation;

    useEffect(()=>{

        if(!fromCreation){
            navigate('/dashboard',{replace: true});
            return;
        }

        const duration = 5000;
        const intervalTime = 50;
        const step = (intervalTime / duration) * 100;

        

        const timer = setInterval(()=>{
            setProgress((prev)=>{
                if (prev <= 0){
                    clearInterval(timer);
                    return 0;
                }
                return prev - step;
            });
        }, intervalTime);

        const redirectTimeout = setTimeout(()=>{
            navigate('/dashboard');
        }, duration);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimeout);
        };
    },[navigate])

  return (
    <div>eventSuccess</div>
  )
}

export default eventSuccess