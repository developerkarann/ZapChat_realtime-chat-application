import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromLocalStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

const initialState = {
    notificationCount: 0,
    newMessagesAlert: getOrSaveFromLocalStorage({ key: NEW_MESSAGE_ALERT, get: true }) || [{
        chatId: '',
        count: 0,
    }]
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        incrementNotification: (state) => {
            state.notificationCount += 1
        },
        resetNotification: (state) => {
            state.notificationCount = 0
        },
        setNewMessagesAlert: (state, action) => {
            const chatId = action.payload.chatId;
            const index = state.newMessagesAlert.findIndex((item) => item.chatId === action.payload.chatId);

            if (index !== -1) {
                state.newMessagesAlert[index].count += 1;
            } else {
                state.newMessagesAlert.push({
                    chatId,
                    count: 1,
                })
            }
        },
        removeNewMessagesAlert: (state, action) => {
            state.newMessagesAlert = state.newMessagesAlert.filter(
                (item) => item.chatId !== action.payload.chatId)
        }
    }
});

export default chatSlice;
export const { incrementNotification, resetNotification, setNewMessagesAlert,
    removeNewMessagesAlert
} = chatSlice.actions