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
  async ({ events, step }) => {
    try {
      console.log('=== INNGEST ORDER PROCESSING START ===');
      console.log('Function ID: create-user-order');
      console.log('Processing order/created events:', events.length);
      
      // Log each event in detail
      events.forEach((event, index) => {
        console.log(`Event ${index + 1}:`, {
          eventName: event.name,
          eventData: event.data,
          hasCustomOrderId: !!event.data.customOrderId,
          hasSubtotal: !!event.data.subtotal,
          customOrderIdValue: event.data.customOrderId || 'NOT_PROVIDED',
          subtotalValue: event.data.subtotal || 'NOT_PROVIDED',
          customOrderIdType: typeof event.data.customOrderId,
          subtotalType: typeof event.data.subtotal
        });
      });
      
      // Create summaries without any database operations
      const orderSummaries = events.map((event) => {
        const summary = {
          customOrderId: event.data.customOrderId || 'LEGACY_ORDER',
          userId: event.data.userId,
          amount: event.data.amount,
          subtotal: event.data.subtotal || 0,
          gst: event.data.gst || 0,
          deliveryCharges: event.data.deliveryCharges || 0,
          discount: event.data.discount || 0,
          itemsCount: event.data.items?.length || 0,
          status: 'Processed by Inngest (Logging Only)',
          timestamp: new Date().toISOString(),
          hasNewFields: !!(event.data.subtotal && event.data.customOrderId)
        };
        
        console.log('Order summary created:', summary);
        return summary;
      });

      console.log('Total orders processed by Inngest:', orderSummaries.length);
      console.log('All order summaries:', orderSummaries);
      
      // Explicitly confirm no database operations
      console.log('CONFIRMATION: No database operations performed');
      console.log('CONFIRMATION: No Order.create() calls made');
      console.log('CONFIRMATION: Only logging and event processing done');
      console.log('=== INNGEST ORDER PROCESSING END ===');

      // Return success without any database operations
      return { 
        success: true, 
        processed: orderSummaries.length,
        message: 'Orders already created in main API, Inngest only logged the events',
        note: 'No database operations performed by Inngest',
        functionId: 'create-user-order',
        timestamp: new Date().toISOString(),
        newFieldsCount: orderSummaries.filter(s => s.hasNewFields).length,
        legacyOrdersCount: orderSummaries.filter(s => !s.hasNewFields).length
      };
      
    } catch (error) {
      console.error('=== INNGEST ERROR ===');
      console.error('Function ID: create-user-order');
      console.error('Error in createUserOrder Inngest function:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('=== INNGEST ERROR END ===');
      throw error;
    }
  }
)