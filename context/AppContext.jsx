"use client";
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { signIn } = useClerk();
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(message);
    }
    // setProducts(productsDummyData);
  };

  const fetchUserData = async () => {
    try {
      if (!user) {
        console.log("No user found");
        return;
      }

      // Check if user has publicMetadata and role
      if (user.publicMetadata?.role === "seller") {
        setIsSeller(true);
      }

      const token = await getToken();
      if (!token) {
        console.log("No token found");
        return;
      }

      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(error.message || "Error fetching user data");
    }
  };

  const addToCart = async (itemId) => {
    if (!user) {
      toast.error("Please login first to add items to cart");
      router.push('/');
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();

        await axios.post(
          "/api/cart/update",
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Item added to cart");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
    if(user){
      try{
        const token = await getToken()
        await axios.post('/api/cart/update', {cartData}, {headers : {Authorization : `Bearer ${token}`}})
        toast.success("Cart Updated ")
      }catch(error){
        toast.error(error.message)
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const value = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
    signIn,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
