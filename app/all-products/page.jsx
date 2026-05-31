'use client'
import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

const AllProducts = () => {
    const { setIsLoading } = useAppContext();
    const router = useRouter();

    useEffect(() => {
        // Redirect to 3D printed products page
        setIsLoading(false);
        router.push("/shop/all-3d-printed");
    }, [setIsLoading, router]);

    return null; // This component will redirect immediately
};

export default AllProducts;
