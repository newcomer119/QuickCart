import connectDb from "@/config/db";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { connect } from "mongoose";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        const{userId} = getAuth(request);
        await connectDb()

        const orders = await Order.find({userId})
            .populate('address')
            .populate('items.product')

        return NextResponse.json({success : true, orders })

    }catch(error){
        return NextResponse.json({success:false, message : error.message})
    }
}