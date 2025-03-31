import axios from 'axios';

interface LoginPayload {
    user_id: string;
    password: string;
}

export const login = (payload: LoginPayload) => axios.post('/api/v1/core/login', payload);

export const logout = () => axios.post('/api/v1/core/logout');
