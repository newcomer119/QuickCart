import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    customOrderId: {type: String, required: false, unique: false}, // Made optional for existing orders
    userId : {type:String, required : true, ref : 'User'}, // Reference to User model
    items:[{
        product : {type:String, required : true, ref : 'Product'},
        quantity : {type : Number, required : true},
        color: {type: String}
    }],
    amount : {type : Number, required : true}, // Final total amount
    subtotal : {type : Number, required: false, default: 0}, // Made optional for existing orders
    gst : {type : Number, required: false, default: 0}, // Made optional for existing orders
    deliveryCharges : {type : Number, required: false, default: 0}, // Made optional for existing orders
    discount : {type : Number, required: false, default: 0}, // Made optional for existing orders
    address : {type : String, ref : 'address', required: true},
    status : {type : String, required: true, default : "Order Placed"},
    paymentMethod : {type : String, required: true, enum : ['COD', 'ONLINE']},
    paymentStatus : {type : String, required: true, default : 'PENDING', enum : ['PENDING', 'COMPLETED', 'FAILED']},
    razorpayOrderId : {type : String},
    razorpayPaymentId : {type : String},
    data : {type : Object, required: true},
    date : {type : Number, required: true},
    // Shiprocket fields
    shiprocketAWB: {type: String, required: false}, // AWB tracking number
    shipmentId: {type: String, required: false}, // Shiprocket shipment ID
    courierName: {type: String, required: false}, // Courier partner name
    trackingUrl: {type: String, required: false}, // Tracking URL
    shipmentStatus: {type: String, required: false, default: 'PENDING'}, // Shipment status from Shiprocket
    pickupScheduledDate: {type: Date, required: false}, // When pickup is scheduled
    expectedDeliveryDate: {type: Date, required: false} // Expected delivery date
})

// Ensure the model is properly registered
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order 