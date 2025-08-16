"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerOrders = async () => {
    try{
      const token = await getToken()
      const response = await axios.get('/api/order/seller-order',{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(response.data.success){
        setOrders(response.data.orders)
        setLoading(false)
      }else{
        toast.error(response.data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  };

  const handleOrderClick = (orderId) => {
    router.push(`/seller/orders/${orderId}`);
  };

  useEffect(() => {
    if (user) {
      fetchSellerOrders();
    }
  }, [user]);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>
          <div className="max-w-4xl rounded-md">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500">No orders found</p>
            ) : (
              orders.map((order, index) => (
                <div
                  key={index}
                  onClick={() => handleOrderClick(order._id)}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <div className="flex-1 flex gap-5 max-w-80">
                    <Image
                      className="max-w-16 max-h-16 object-cover"
                      src={assets.box_icon}
                      alt="box_icon"
                    />
                    <p className="flex flex-col gap-3">
                      <span className="font-medium">
                        {order.items
                          .map(
                            (item) => (item.product?.name || 'Product Name Unavailable') + ` x ${item.quantity}`
                          )
                          .join(", ")}
                      </span>
                      <span>Items : {order.items.length}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">
                        {order.address?.fullName || 'Name Unavailable'}
                      </span>
                      <br />
                      <span>{order.address?.area || 'Area Unavailable'}</span>
                      <br />
                      <span>{`${order.address?.city || 'City'}, ${order.address?.state || 'State'}`}</span>
                      <br />
                      <span>{order.address?.phoneNumber || 'Phone Unavailable'}</span>
                    </p>
                  </div>
                  <p className="font-medium my-auto">
                    {currency}
                    {order.amount}
                  </p>
                  <div>
                    <p className="flex flex-col">
                      <span>Method : {order.paymentMethod}</span>
                      <span>
                        Date : {new Date(order.date).toLocaleDateString()}
                      </span>
                      <span className={`font-medium ${order.paymentStatus === 'COMPLETED' ? 'text-green-600' : 'text-orange-600'}`}>
                        Payment : {order.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
