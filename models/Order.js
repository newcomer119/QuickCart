import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId : {type:String, required : true, ref : 'user'},
    items:[{
        product : {type:String, required : true, ref : 'Product'},
        quantity : {type : Number, required : true}
    }],
    amount : {type : Number, required : true},
    address : {type : String, ref : 'address', required : true},
    status : {type : String, required : true, default : "Order Placed"},
    paymentMethod : {type : String, required : true, enum : ['COD', 'ONLINE']},
    paymentStatus : {type : String, required : true, default : 'PENDING', enum : ['PENDING', 'COMPLETED', 'FAILED']},
    razorpayOrderId : {type : String},
    razorpayPaymentId : {type : String},
    data : {type : Object, required : true},
    date : {type : Number, required : true}
})

const Order = mongoose.models.order || mongoose.model('order', orderSchema)

export default Order 