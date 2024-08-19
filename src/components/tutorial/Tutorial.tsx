import React from 'react'
import Image from 'next/image'

const Tutorial = () => {
  return (
    <div className='mt-8 flex flex-col gap-12 items-center'>
        <div className='flex flex-col gap-4 items-center'>
            <h1 className="text-xl font-semibold mb-4 text-gray-800">Trying to get a 360 view? Rotate.</h1>
            <Image src='/rotate.png' alt='rotate' height={100} width={100} className='mb-4' />
            <p className='font-thin text-sm max-w-sm text-center'>Click and drag anywhere on the 3D image to rotate it around different axes. This allows you to view the object from multiple angles.</p>
        </div>
        <div className='flex flex-col gap-4 items-center'>
            <h1 className="text-xl font-semibold mb-4 text-gray-800">Got an eye for detail? Zoom</h1>
            <Image src='/zoom.png' alt='zoom' height={80} width={80} className='mb-4' />
            <p className='font-thin text-sm max-w-sm text-center'>Use pinch gestures (on touch devices) to zoom in and out of the 3D image. Zooming enables you to inspect finer details up close.</p>
        </div>
        <div className='flex flex-col gap-4 items-center'>
            <h1 className="text-xl font-semibold mb-4 text-gray-800">Want to see a different side? Pan.</h1>
            <Image src='/pan.png' alt='pan' height={80} width={80} className='mb-4' />
            <p className='font-thin text-sm max-w-sm text-center'>Use two-finger swipe gestures (on touch devices) to pan the 3D image horizontally and vertically.</p>
        </div>
        <div className='flex flex-col gap-4 items-center'>
            <h1 className="text-xl font-semibold mb-4 text-gray-800 mb-6">Want to try on a different colour? Tap.</h1>
            <Image src='/colour.png' alt='colour' height={100} width={120} className='mb-4' />
            <p className='font-thin text-sm max-w-sm text-center'> Interact with the colour of the 3D image by clicking or tapping on a colour in the colour panel on the product page. </p>
        </div>


    </div>
  )
}

export default Tutorial