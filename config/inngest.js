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
    try {
      console.log("Received clerk user.created event:", JSON.stringify(event.data, null, 2));
      
      const { 
        id, 
        first_name, 
        last_name, 
        email_addresses, 
        image_url,
        profile_image_url,
        external_accounts 
      } = event.data;

      // Get the best available image URL
      let imageUrl = image_url || profile_image_url;
      
      // If no image from main fields, try to get from external accounts (Google OAuth)
      if (!imageUrl && external_accounts && external_accounts.length > 0) {
        const googleAccount = external_accounts.find(acc => acc.provider === 'oauth_google');
        if (googleAccount) {
          imageUrl = googleAccount.image_url || googleAccount.picture;
        }
      }

      const userData = {
        _id: id,
        email: email_addresses?.[0]?.email_address || '',
        name: `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown User',
        imageUrl: imageUrl || '',
        cartItems: {}
      };

      console.log("Creating user with data:", userData);

      await connectDb();
      const createdUser = await User.create(userData);
      
      console.log("User created successfully:", createdUser._id);
      return { success: true, userId: createdUser._id };
      
    } catch (error) {
      console.error("Error in syncUserCreation:", error);
      throw error;
    }
  }
);

// Inngest function to update the user from database
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      console.log("Received clerk user.updated event:", JSON.stringify(event.data, null, 2));
      
      const { 
        id, 
        first_name, 
        last_name, 
        email_addresses, 
        image_url,
        profile_image_url,
        external_accounts 
      } = event.data;

      // Get the best available image URL
      let imageUrl = image_url || profile_image_url;
      
      // If no image from main fields, try to get from external accounts (Google OAuth)
      if (!imageUrl && external_accounts && external_accounts.length > 0) {
        const googleAccount = external_accounts.find(acc => acc.provider === 'oauth_google');
        if (googleAccount) {
          imageUrl = googleAccount.image_url || googleAccount.picture;
        }
      }

      const userData = {
        email: email_addresses?.[0]?.email_address || '',
        name: `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown User',
        imageUrl: imageUrl || ''
      };

      console.log("Updating user with data:", userData);

      await connectDb();
      const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
      
      if (!updatedUser) {
        console.log("User not found, creating new user");
        const newUserData = { ...userData, _id: id, cartItems: {} };
        const createdUser = await User.create(newUserData);
        console.log("User created successfully:", createdUser._id);
        return { success: true, userId: createdUser._id };
      }
      
      console.log("User updated successfully:", updatedUser._id);
      return { success: true, userId: updatedUser._id };
      
    } catch (error) {
      console.error("Error in syncUserUpdation:", error);
      throw error;
    }
  }
);

// ingest function to delete user from the database 
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk"
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      console.log("Received clerk user.deleted event:", JSON.stringify(event.data, null, 2));
      
      const { id } = event.data;
      
      if (!id) {
        console.error("No user ID provided in deletion event");
        return { success: false, error: "No user ID provided" };
      }

      await connectDb();
      const deletedUser = await User.findByIdAndDelete(id);
      
      if (!deletedUser) {
        console.log("User not found for deletion:", id);
        return { success: false, error: "User not found" };
      }
      
      console.log("User deleted successfully:", id);
      return { success: true, userId: id };
      
    } catch (error) {
      console.error("Error in syncUserDeletion:", error);
      throw error;
    }
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
        items: event.data.items.map(item => {
          const [productId, ...colorParts] = item.product.split('_');
          return {
            product: productId,
            quantity: item.quantity,
            color: item.color || (colorParts.length > 0 ? colorParts.join('_') : null)
          };
        }),
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