/**
 * Generates a custom order ID in the format: ORDER-{timestamp}
 * This avoids circular dependency issues
 */
export async function generateCustomOrderId() {
    try {
        const timestamp = Date.now();
        const customOrderId = `ORDER-${timestamp}`;
        
        console.log('Generated custom order ID:', {
            timestamp,
            customOrderId
        });
        
        return customOrderId;
    } catch (error) {
        console.error('Error generating custom order ID:', error);
        // Fallback to timestamp-based ID if there's an error
        const timestamp = Date.now();
        return `ORDER-${timestamp}`;
    }
}
