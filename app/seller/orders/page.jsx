"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();
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
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
                >
                  <div className="flex-1 flex gap-5 max-w-80">
                    <Image
                      className="max-w-16 max-h-16 object-cover"
                      src={assets.box_icon}
                      alt="box_icon"
                    />
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-bold text-orange-600">
                          Order #{order.customOrderId || 'N/A'}
                        </span>
                        <span className="font-medium">
                          {order.items
                            .map(
                              (item) => (item.product?.name || 'Product Name Unavailable') + ` x ${item.quantity}`
                            )
                            .join(", ")}
                        </span>
                      </div>
                      <span>Items : {order.items.length}</span>
                    </div>
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
                  <div className="text-right">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between gap-4">
                        <span>Subtotal:</span>
                        <span>{currency}{order.subtotal || 0}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>GST (18%):</span>
                        <span>{currency}{order.gst || 0}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Delivery:</span>
                        <span>{currency}{order.deliveryCharges || 0}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between gap-4 text-green-600">
                          <span>Discount:</span>
                          <span>-{currency}{order.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between gap-4 font-medium border-t pt-1">
                        <span>Total:</span>
                        <span>{currency}{order.amount}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="flex flex-col">
                      <span>Method : {order.paymentMethod}</span>
                      <span>
                        Date : {new Date(order.date).toLocaleDateString()}
                      </span>
                      <span>Payment : {order.paymentStatus}</span>
                      <span>Status : {order.status}</span>
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
