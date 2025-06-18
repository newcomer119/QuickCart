import { Inngest } from "inngest";
import connectDb from "./db";
import User from "@/models/Users";
import Order from "@/models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "filament-next" });

export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };
    await connectDb();
    await User.create(userData);
  }
);

// Inngest function to update the user from database
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url,
    };
    await connectDb()
    await User.findByIdAndUpdate(id, userData)
  }
);

// ingest function to delete user from the database 
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk"
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data
    await connectDb()
    await User.findByIdAndDelete(id)
  }
)

// inngest function to create user's order in database 
export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order",
    batchEvents: {
      maxSize: 5,
      timeout: "5s"
    }
  },
  { event: "order/created" },
  async ({ events }) => {
    const orders = events.map((event) => {
      return {
        userId: event.data.userId,
        items: event.data.items,
        amount: event.data.amount,
        address: event.data.address,
        paymentMethod: event.data.paymentMethod,
        paymentStatus: event.data.paymentStatus || 'PENDING',
        status: event.data.status || 'Order Placed',
        date: event.data.date,
        data: event.data // Include the entire data object
      }
    })

    await connectDb()
    await Order.insertMany(orders)

    return { success: true, processed: orders.length };
  }
)