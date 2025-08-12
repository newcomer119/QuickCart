import Order from "@/models/Order";

/**
 * Generates a custom order ID in the format: 25-26/W/0001
 * Where:
 * - 25-26: Current financial year (April 2025 - March 2026)
 * - W: Week identifier (can be customized)
 * - 0001: Sequential order number for the current period
 */
export async function generateCustomOrderId() {
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
        
        // Determine financial year (April to March)
        let financialYearStart, financialYearEnd;
        if (currentMonth >= 4) {
            // April to December - current year to next year
            financialYearStart = currentYear;
            financialYearEnd = currentYear + 1;
        } else {
            // January to March - previous year to current year
            financialYearStart = currentYear - 1;
            financialYearEnd = currentYear;
        }
        
        // Format: 25-26 (for 2025-2026)
        const yearRange = `${financialYearStart.toString().slice(-2)}-${financialYearEnd.toString().slice(-2)}`;
        
        // Week identifier (you can customize this)
        const weekIdentifier = 'W'; // You can change this to any identifier you prefer
        
        // Get the current week number within the financial year
        const financialYearStartDate = new Date(financialYearStart, 3, 1); // April 1st
        const currentWeek = Math.ceil((currentDate - financialYearStartDate) / (7 * 24 * 60 * 60 * 1000));
        const weekNumber = Math.max(1, currentWeek);
        
        // Find the next sequential order number for this period
        const periodStart = new Date(financialYearStart, 3, 1); // April 1st
        const periodEnd = new Date(financialYearEnd, 2, 31); // March 31st
        
        const lastOrder = await Order.findOne({
            date: { $gte: periodStart.getTime(), $lte: periodEnd.getTime() }
        }).sort({ customOrderId: -1 });
        
        let sequenceNumber = 1;
        if (lastOrder && lastOrder.customOrderId) {
            // Extract the sequence number from the last order ID
            const lastSequence = parseInt(lastOrder.customOrderId.split('/').pop());
            if (!isNaN(lastSequence)) {
                sequenceNumber = lastSequence + 1;
            }
        }
        
        // Format: 25-26/W/0001
        const formattedSequence = sequenceNumber.toString().padStart(4, '0');
        const customOrderId = `${yearRange}/${weekIdentifier}/${formattedSequence}`;
        
        console.log('Generated custom order ID:', {
            currentDate: currentDate.toISOString(),
            financialYear: `${financialYearStart}-${financialYearEnd}`,
            yearRange,
            weekNumber,
            sequenceNumber,
            customOrderId
        });
        
        return customOrderId;
    } catch (error) {
        console.error('Error generating custom order ID:', error);
        // Fallback to timestamp-based ID if there's an error
        const timestamp = Date.now().toString().slice(-8);
        return `FALLBACK-${timestamp}`;
    }
}

/**
 * Alternative simpler version that just uses financial year and sequence
 * Format: 25-26/0001
 */
export async function generateSimpleOrderId() {
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        // Determine financial year
        let financialYearStart, financialYearEnd;
        if (currentMonth >= 4) {
            financialYearStart = currentYear;
            financialYearEnd = currentYear + 1;
        } else {
            financialYearStart = currentYear - 1;
            financialYearEnd = currentYear;
        }
        
        const yearRange = `${financialYearStart.toString().slice(-2)}-${financialYearEnd.toString().slice(-2)}`;
        
        // Find the next sequential order number for this financial year
        const periodStart = new Date(financialYearStart, 3, 1);
        const periodEnd = new Date(financialYearEnd, 2, 31);
        
        const lastOrder = await Order.findOne({
            date: { $gte: periodStart.getTime(), $lte: periodEnd.getTime() }
        }).sort({ customOrderId: -1 });
        
        let sequenceNumber = 1;
        if (lastOrder && lastOrder.customOrderId) {
            const lastSequence = parseInt(lastOrder.customOrderId.split('/').pop());
            if (!isNaN(lastSequence)) {
                sequenceNumber = lastSequence + 1;
            }
        }
        
        const formattedSequence = sequenceNumber.toString().padStart(4, '0');
        return `${yearRange}/${formattedSequence}`;
    } catch (error) {
        console.error('Error generating simple order ID:', error);
        const timestamp = Date.now().toString().slice(-8);
        return `FALLBACK-${timestamp}`;
    }
}
