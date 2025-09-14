/**
 * Shiprocket API Integration
 * Handles all Shiprocket API operations for QuickCart
 */

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

// Shiprocket credentials
const SHIPROCKET_EMAIL = 'mitarthpandey@gmail.com';
const SHIPROCKET_PASSWORD = 'Lc9b*A0bsPJ@aF!D';

// Token cache to avoid repeated authentication
let authToken = null;
let tokenExpiry = null;

/**
 * Authenticate with Shiprocket and get access token
 * @returns {Promise<string>} Access token
 */
async function authenticateShiprocket() {
    try {
        // Check if we have a valid cached token
        if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
            return authToken;
        }

        const response = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: SHIPROCKET_EMAIL,
                password: SHIPROCKET_PASSWORD
            })
        });

        if (!response.ok) {
            throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.token) {
            throw new Error('No token received from Shiprocket');
        }

        // Cache the token (assume 24 hours validity, refresh 1 hour before expiry)
        authToken = data.token;
        tokenExpiry = Date.now() + (23 * 60 * 60 * 1000); // 23 hours

        return authToken;
    } catch (error) {
        console.error('Shiprocket authentication error:', error);
        throw new Error(`Failed to authenticate with Shiprocket: ${error.message}`);
    }
}

/**
 * Make authenticated API request to Shiprocket
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response
 */
async function makeShiprocketRequest(endpoint, options = {}) {
    try {
        const token = await authenticateShiprocket();
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(`${SHIPROCKET_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Shiprocket API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Shiprocket API request error:', error);
        throw error;
    }
}

/**
 * Create a shipment in Shiprocket
 * @param {Object} shipmentData - Shipment details
 * @returns {Promise<Object>} Created shipment details
 */
async function createShipment(shipmentData) {
    try {
        const response = await makeShiprocketRequest('/orders/create/adhoc', {
            method: 'POST',
            body: JSON.stringify(shipmentData)
        });

        return response;
    } catch (error) {
        console.error('Error creating shipment:', error);
        throw new Error(`Failed to create shipment: ${error.message}`);
    }
}

/**
 * Get shipping rates for a shipment
 * @param {Object} rateData - Rate calculation details
 * @returns {Promise<Array>} Available shipping rates
 */
async function getShippingRates(rateData) {
    try {
        const response = await makeShiprocketRequest('/courier/assign/available', {
            method: 'POST',
            body: JSON.stringify(rateData)
        });

        return response.data;
    } catch (error) {
        console.error('Error getting shipping rates:', error);
        throw new Error(`Failed to get shipping rates: ${error.message}`);
    }
}

/**
 * Track shipment by AWB number
 * @param {string} awbNumber - AWB tracking number
 * @returns {Promise<Object>} Tracking details
 */
async function trackShipment(awbNumber) {
    try {
        const response = await makeShiprocketRequest(`/orders/awb/${awbNumber}`);
        return response;
    } catch (error) {
        console.error('Error tracking shipment:', error);
        throw new Error(`Failed to track shipment: ${error.message}`);
    }
}

/**
 * Cancel a shipment
 * @param {string} shipmentId - Shipment ID to cancel
 * @returns {Promise<Object>} Cancellation response
 */
async function cancelShipment(shipmentId) {
    try {
        const response = await makeShiprocketRequest(`/orders/cancel/shipment/${shipmentId}`, {
            method: 'POST'
        });

        return response;
    } catch (error) {
        console.error('Error cancelling shipment:', error);
        throw new Error(`Failed to cancel shipment: ${error.message}`);
    }
}

/**
 * Get all shipments for a channel
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Shipments list
 */
async function getShipments(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/orders?${queryParams}`;
        
        const response = await makeShiprocketRequest(endpoint);
        return response;
    } catch (error) {
        console.error('Error getting shipments:', error);
        throw new Error(`Failed to get shipments: ${error.message}`);
    }
}

/**
 * Get pickup locations from Shiprocket
 * @returns {Promise<Array>} Available pickup locations
 */
async function getPickupLocations() {
    try {
        const response = await makeShiprocketRequest('/settings/company/pickup');
        return response.data;
    } catch (error) {
        console.error('Error getting pickup locations:', error);
        throw new Error(`Failed to get pickup locations: ${error.message}`);
    }
}

/**
 * Test Shiprocket connection
 * @returns {Promise<Object>} Test result
 */
async function testConnection() {
    try {
        const token = await authenticateShiprocket();
        return {
            success: true,
            message: 'Shiprocket connection successful',
            token: token.substring(0, 20) + '...' // Show partial token for verification
        };
    } catch (error) {
        return {
            success: false,
            message: `Shiprocket connection failed: ${error.message}`
        };
    }
}

module.exports = {
    authenticateShiprocket,
    makeShiprocketRequest,
    createShipment,
    getShippingRates,
    trackShipment,
    cancelShipment,
    getShipments,
    getPickupLocations,
    testConnection
};
