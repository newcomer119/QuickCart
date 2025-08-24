/**
 * Generates a custom order ID in the format: 25-26/W/0001
 * Where:
 * - 25-26: Current financial year (April 2025 - March 2026)
 * - W: Week identifier (can be customized)
 * - 0001: Sequential order number for the current period
 */
export async function generateCustomOrderId() {
    try {
        console.log('Starting custom order ID generation...');
        
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
        
        console.log('Date info:', { currentDate, currentYear, currentMonth });
        
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
        
        // For now, use timestamp-based sequence to avoid circular dependency
        // In production, you might want to use a database sequence or counter
        const timestamp = Date.now();
        const sequenceNumber = Math.floor(timestamp / 1000) % 10000; // Use last 4 digits of timestamp
        
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
        
        // Validate the generated ID
        if (!customOrderId || typeof customOrderId !== 'string' || customOrderId.length === 0) {
            throw new Error('Generated customOrderId is invalid');
        }
        
        return customOrderId;
    } catch (error) {
        console.error('Error generating custom order ID:', error);
        // Fallback to timestamp-based ID if there's an error
        const timestamp = Date.now();
        const fallbackId = `ORDER-${timestamp}`;
        console.log('Using fallback ID:', fallbackId);
        return fallbackId;
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
        
        // Use timestamp-based sequence to avoid circular dependency
        const timestamp = Date.now();
        const sequenceNumber = Math.floor(timestamp / 1000) % 10000;
        
        const formattedSequence = sequenceNumber.toString().padStart(4, '0');
        return `${yearRange}/${formattedSequence}`;
    } catch (error) {
        console.error('Error generating simple order ID:', error);
        const timestamp = Date.now();
        return `ORDER-${timestamp}`;
    }
}
