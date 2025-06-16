'use client'
import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import EmailSender from '@/components/EmailSender'

const OrderPlaced = () => {
  const { router, user } = useAppContext()
  const [orderDetails, setOrderDetails] = useState(null)

  useEffect(() => {
    // Get the order details from localStorage
    const storedOrder = localStorage.getItem('lastOrder')
    console.log('Retrieved order details from localStorage:', storedOrder);
    
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder)
        console.log('Parsed order details:', parsedOrder);
        setOrderDetails(parsedOrder)
      } catch (error) {
        console.error('Error parsing order details:', error)
      }
    }

    setTimeout(() => {
      router.push('/my-orders')
    }, 5000)
  }, [])

  return (
    <div className='h-screen flex flex-col justify-center items-center gap-5'>
      <div className="flex justify-center items-center relative">
        <Image className="absolute p-5" src={assets.checkmark} alt='' />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl font-semibold">Order Placed Successfully</div>
      {orderDetails && <EmailSender orderDetails={orderDetails} />}
    </div>
  )
}

export default OrderPlaced