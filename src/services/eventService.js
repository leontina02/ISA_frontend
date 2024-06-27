import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const fetchEvents = (token) => {
    return axios.get(`${API_URL}/events`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const fetchBooks = (token) => {
    return axios.get(`${API_URL}/books`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const createEvent = (token, event) => {
    return axios.post(`${API_URL}/events`, event, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const assignBooksToEvent = (token, eventId, bookIds) => {
    return axios.put(`${API_URL}/events/${eventId}/books`, bookIds, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
