import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, adminLogout, getAdmin } from "../thunks/admin";
import toast from 'react-hot-toast'

const initialState = {
    user: null,
    isAdmin: false,
    isLoading: true
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userExits: (state, action) => {
            state.user = action.payload,
                state.isLoading = false
        },
        userNotExits: (state, action) => {
            state.user = null,
                state.isLoading = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.isAdmin = true;
                toast.success(action.payload)
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.isAdmin = false;
                toast.error(action.error.message)
            })
            .addCase(getAdmin.fulfilled, (state, action) => {
                if (action.payload === true) {
                    state.isAdmin = true;
                } else {
                    state.isAdmin = false;
                }
            })
            .addCase(getAdmin.rejected, (state, action) => {
                state.isAdmin = false;
            })
            .addCase(adminLogout.fulfilled, (state, action) => {
                state.isAdmin = false;
                toast.success(action.payload)
            })
            .addCase(adminLogout.rejected, (state, action) => {
                state.isAdmin = true;
                toast.error(action.error.message)
            })
    }
});

export default authSlice
export const { userExits, userNotExits } = authSlice.actions