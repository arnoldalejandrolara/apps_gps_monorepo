import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [],
    notifications_list: [],
};

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.push(action.payload);
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
        },
        addNotificationList: (state, action) => {
            state.notifications_list.push(...action.payload);
        },
        removeNotificationList: (state, action) => {
            state.notifications_list = state.notifications_list.filter(notification => notification.id !== action.payload);
        },
        addOneNotificationToList: (state, action) => {
            // uncheck is_new from all notifications_list
            state.notifications_list = state.notifications_list.map(notification => ({
                ...notification,
                is_new: false
            }));
            // insert in the first position
            state.notifications_list.unshift(action.payload);
        },
        removeOneNotificationFromList: (state, action) => {
            state.notifications_list = state.notifications_list.filter(notification => notification.id !== action.payload);
        },
        resetNotifications: (state) => {
            state.notifications = [];
            state.notifications_list = [];
        }
    },
});

export const { addNotification, removeNotification, addNotificationList, removeNotificationList, addOneNotificationToList, removeOneNotificationFromList, resetNotifications } =
    notificationSlice.actions;

export default notificationSlice.reducer;