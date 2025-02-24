import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi, postApi } from '../../services/api';

export const fetchMeetingData = createAsyncThunk('fetchMeetingData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(user.role === 'superAdmin' ? 'api/meeting' : `api/meeting/?createBy=${user._id}`);
        return Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
        console.error("Meeting fetch error:", error);
        throw error;
    }
});

export const createMeeting = createAsyncThunk('createMeeting', async (data) => {
    try {
        const response = await postApi('api/meeting', data);
        return response.data;
    } catch (error) {
        throw error;
    }
});

const meetingSlice = createSlice({
    name: 'meeting',
    initialState: {
        data: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMeetingData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMeetingData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchMeetingData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.data = [];
            });
    }
});

export default meetingSlice.reducer;