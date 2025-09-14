'use client'
import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import EmailSender from '@/components/EmailSender'
import Link from 'next/link'

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
    <div className='min-h-screen flex flex-col justify-center items-center gap-8 px-4'>
      <div className="flex justify-center items-center relative">
        <Image className="absolute p-5" src={assets.checkmark} alt='' />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      
      <div className="text-center space-y-4">
        <div className="text-3xl font-bold text-green-600">Order Placed Successfully!</div>
        {orderDetails && (
          <div className="text-lg text-gray-700">
            Order ID: <span className="font-semibold text-blue-600">{orderDetails.customOrderId}</span>
          </div>
        )}
        <div className="text-gray-600">
          You will receive a confirmation email shortly.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {orderDetails && (
          <Link
            href={`/track-order?trackingId=${orderDetails.customOrderId}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Track Your Order
          </Link>
        )}
        
        <Link
          href="/my-orders"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          View All Orders
        </Link>
        
        <Link
          href="/all-products"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Email Sender */}
      {orderDetails && <EmailSender orderDetails={orderDetails} />}
      
      {/* Auto redirect notice */}
      <div className="text-sm text-gray-500 text-center">
        You will be automatically redirected to your orders page in a few seconds...
      </div>
    </div>
  )
}

export default OrderPlaced