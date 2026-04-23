import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const AUTH_STORAGE_KEY = 'wtlmini-dummy-auth';

// Helper to get the dummy auth user
const readAuthUser = () => {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

// API Functions
export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/signup`, userData);
        return { data: response.data };
    } catch (error) {
        console.error("Signup error:", error);
        throw error;
    }
};

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return { data: response.data };
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const getAllClaims = async () => {
    try {
        const response = await axios.get(`${API_URL}/claims/all`);
        return { data: response.data };
    } catch (error) {
        console.error("Error fetching all claims:", error);
        throw error;
    }
};

export const getNotifications = async (getToken) => {
    try {
        const response = await axios.get(`${API_URL}/notifications/my`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return { data: response.data };
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

export const markNotificationAsRead = async (id) => {
    try {
        const response = await axios.patch(`${API_URL}/notifications/${id}/read`);
        return { data: response.data };
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};

export const getAllItems = async () => {
    try {
        const response = await axios.get(`${API_URL}/items`);
        // Map the backend image path to a full URL if necessary
        const items = response.data.map(item => ({
            ...item,
            id: item._id, // Use _id as id for frontend compatibility
            image_url: item.imageUrl.startsWith('/uploads') ? `http://localhost:5000${item.imageUrl}` : item.imageUrl,
            item_name: item.itemName, // Match frontend expected property names
            location_found: item.locationFound,
            found_date: item.foundDate,
            created_at: item.createdAt
        }));
        return { data: items };
    } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
    }
};

export const getItemById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/items/${id}`);
        const item = response.data;
        return {
            data: {
                ...item,
                id: item._id,
                image_url: item.imageUrl.startsWith('/uploads') ? `http://localhost:5000${item.imageUrl}` : item.imageUrl,
                item_name: item.itemName,
                location_found: item.locationFound,
                found_date: item.foundDate
            }
        };
    } catch (error) {
        console.error("Error fetching item:", error);
        throw error;
    }
};

export const createItem = async (formData, getToken) => {
    try {
        // We'll use FormData for the multipart upload
        const response = await axios.post(`${API_URL}/items`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        return { data: response.data };
    } catch (error) {
        console.error("Error creating item:", error);
        throw error;
    }
};

// Keep other functions as mocks or stubs for now as requested
export const getMyListings = async (getToken) => {
    try {
        const response = await axios.get(`${API_URL}/items/my`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const items = response.data.map(item => ({
            ...item,
            id: item._id,
            image_url: item.imageUrl.startsWith('/uploads') ? `http://localhost:5000${item.imageUrl}` : item.imageUrl,
            item_name: item.itemName,
            location_found: item.locationFound,
            found_date: item.foundDate,
            created_at: item.createdAt
        }));
        return { data: items };
    } catch (error) {
        console.error("Error fetching my listings:", error);
        throw error;
    }
};

export const updateItem = async (id, data, getToken) => {
    console.warn("Update item is currently limited in the DB version");
    return { data: { success: true } };
};

export const deleteItem = async (id, getToken) => {
    console.warn("Delete item is currently limited in the DB version");
    return { data: { success: true } };
};

export const createClaim = async (itemId, claimData, getToken) => {
    try {
        const response = await axios.post(`${API_URL}/claims`, {
            itemId,
            claimMessage: claimData.claimMessage,
            contactPhone: claimData.contactPhone,
            proofDetails: claimData.proofDetails
        }, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return { data: response.data };
    } catch (error) {
        console.error("Error creating claim:", error);
        throw error;
    }
};

export const getClaimsForItem = async (itemId, getToken) => {
    try {
        const response = await axios.get(`${API_URL}/claims/item/${itemId}`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return { data: response.data };
    } catch (error) {
        console.error("Error fetching claims for item:", error);
        throw error;
    }
};

export const getMyClaims = async (getToken) => {
    try {
        const response = await axios.get(`${API_URL}/claims/my`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return { data: response.data };
    } catch (error) {
        console.error("Error fetching my claims:", error);
        throw error;
    }
};

export const approveClaim = async (data, getToken) => {
    try {
        const response = await axios.patch(`${API_URL}/claims/${data.claimId}/status`, {
            status: 'approved'
        }, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        return { data: response.data };
    } catch (error) {
        console.error("Error approving claim:", error);
        throw error;
    }
};

export const getItemsReport = async (days) => {
    return getAllItems();
};