import connectDb from "@/config/db"
import authSeller from "@/lib/authSeller"
import Product from "@/models/Product"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(req) {
    try {
        const { userId } = auth()
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' })
        }

        const isSeller = authSeller(userId)
        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized as seller' })
        }

        await connectDb()
        const products = await Product.find({})
        return NextResponse.json({ success: true, products })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}