import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { server } from '../../constants/config'

const adminLogin = createAsyncThunk('admin/login', async (secretKey) => {
    try {
        const config = {
            withCredentials: true, headers: { "Content-Type": "application/json" }
        }

        const { data } = await axios.post(`${server}/api/admin/verify`, { secretKey }, config);
        return data.message;

    } catch (error) {
        throw error.response.data.message;
    }
})
const getAdmin = createAsyncThunk('admin/getadmin', async () => {
    try {

        const { data } = await axios.get(`${server}/api/admin`, { withCredentials: true });

        return data.admin;

    } catch (error) {
        throw error.response.data.message;
    }
})
const adminLogout = createAsyncThunk('admin/logout', async () => {
    try {

        const { data } = await axios.get(`${server}/api/admin/logout`, { withCredentials: true });

        return data.message;

    } catch (error) {
        throw error.response.data.message;
    }
})


export { adminLogin, getAdmin , adminLogout }