import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosClient } from '../../../../utils/axiosClient'
import StaticInterest from '../../../Events/MyEvents/components/StaticInterest'

const PublicDetails = ({ name, address, description, interests }) => {

    console.log(address);

    return (
        <>
            <div className='bg-white-to-black lg:w-1/3 rounded-lg border-lightgray-to-yellow p-6'>
                <div className='my-1'>
                    <h1 className='font-bold text-indigo-to-yellow text-xl border-b-2'>Nombre de usuario</h1>
                    <p className='py-2 text-lg font-bold'>{name}</p>
                </div>
                <div className='my-4'>
                    <h1 className='font-bold text-xl text-indigo-to-yellow border-b-2'>Ubicación</h1>
                    {address ? (
                        <div className='flex'>
                            <p className='my-1'>{address.province}
                                {address.city ? `, ${address.city}` : ""}
                            </p>
                        </div>
                    ) : (
                        <p className='my-1'>Este usuario no ha indicado su ubicación.</p>
                    )}

                </div>
                <div className='my-4'>
                    <h1 className='font-bold text-xl text-indigo-to-yellow border-b-2'>Descripción</h1>

                    {description ? (
                        <p className='my-1'>{description}</p>
                    ) : (
                        <p className='my-1'>Este usuario no ha indicado una descripción.</p>
                    )}
                </div>
                <div className='my-4'>
                    <h1 className='font-bold text-xl text-indigo-to-yellow border-b-2'>Intereses</h1>
                    <div className='flex flex-wrap justify-around my-3'>
                        {interests.map((interestName, index) => (
                            <StaticInterest key={index} interestName={interestName} />
                        ))}
                    </div>
                </div>
            </div>

        </>
    )
}

export default PublicDetails