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
  const [isLoading, setIsLoading] = useState(false);

  const fetchProductData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
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

  const addToCart = async (itemId, selectedColor = null, colorImage = null) => {
    if (!user) {
      toast.error("Please login first to add items to cart");
      router.push('/');
      return;
    }
    let cartData = structuredClone(cartItems);
    const cartKey = selectedColor ? `${itemId}_${selectedColor}` : itemId;
    if (cartData[cartKey]) {
      toast.success("Item is already in your cart");
    } else {
      cartData[cartKey] = {
        quantity: 1,
        color: selectedColor,
        colorImage: colorImage
      };
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
    }
  };

  const updateCartQuantity = async (itemId, quantity, selectedColor = null, colorImage = null) => {
    let cartData = structuredClone(cartItems);
    const cartKey = selectedColor ? `${itemId}_${selectedColor}` : itemId;
    if (quantity === 0) {
      delete cartData[cartKey];
    } else {
      cartData[cartKey] = {
        quantity: quantity,
        color: selectedColor,
        colorImage: colorImage
      };
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
      if (cartItems[items] && cartItems[items].quantity > 0) {
        const itemId = items.split('_')[0];
        if (products.find(product => product._id === itemId)) {
          totalCount += cartItems[items].quantity;
        }
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      if (cartItems[items] && cartItems[items].quantity > 0) {
        const itemId = items.split('_')[0]; // Extract itemId from cartKey
        let itemInfo = products.find((product) => product._id === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.offerPrice * cartItems[items].quantity;
        }
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
    isLoading,
    setIsLoading,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
