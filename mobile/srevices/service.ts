import "react-native-url-polyfill/auto";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from "expo-image-picker";
import { User } from './types'


interface loginResponse {
    token: string;
    user: User;
    error?: any;
}

interface createAccountResponse {
    token: string;
    user: User;
    status: number;
    msg: string;
}

interface DecodedToken {
    id: number;
    iat: number;
    exp: number;
}


const BASE_URL = 'http://192.168.1.217:3000/api';
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Function to store JWT token in AsyncStorage
const storeToken = async (token: string) => {
    try {
        await AsyncStorage.setItem('token', token);
    } catch (error) {
        console.error('Error storing the token', error);
    }
};

// Function to retrieve JWT token from AsyncStorage
const getToken = async () => {
    try {
        return await AsyncStorage.getItem('token');
    } catch (error) {
        console.error('Error retrieving the token', error);
        return null;
    }
};

// Function to remove JWT token from AsyncStorage
const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('token');
    } catch (error) {
        console.error('Error removing the token', error);
    }
};

// Function to decode JWT token
const decodeToken = (token: string): DecodedToken => {
    return jwtDecode<DecodedToken>(token);
};

class UserError extends Error {
    constructor(title, message) {
        super(message);
        this.name = `${title} error`;
    }
}
// Login function
export const login = async (email: string, password: string) => {
    try {
        const response = await api.post<loginResponse>('/login', {
            email,
            password,
        });

        const { token, user } = response.data;

        if (token) await storeToken(token);
        if (user) {

            return { user, error: false };
        }

        return { user, error: true };
    } catch (error) {
        const { response } = error
        const { status, data } = response
        if (status === 401) {
            throw new UserError('Password', data);
        }
        if (status === 404) {
            throw new UserError('Sign up', data);
        }
        else console.error('Login error', error);
    }
};

// Signup function
export const createAccount = async (name: string, email: string, password: string) => {
    try {
        const response = await api.post<createAccountResponse>('/register', {
            name,
            email,
            password
        });
        const { status, token, user, msg } = response.data;
        if (status === 201) { // Usere created
            await storeToken(token);
            return { user, msg };
        } else {
            return { user, msg: 'User did not created, try again.' };
        }
    } catch (error) {
        console.error('Sign up error', error);
        throw error;
    }
};

// Logout function
export const logout = async () => {
    try {
        await removeToken();
    } catch (error) {
        throw error;
    }
};

// Function to get the current user
export const getCurrentUser = async () => {
    const token = await getToken();
    if (token) {
        return decodeToken(token);
    }
    return null;
};