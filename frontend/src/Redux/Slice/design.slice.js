import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Utils/baseUrl";
import { setAlert } from "./alert.slice";

const initialStateDesign = {
    allDesign: [],
    currDesign: null,
    success: false,
    message: '',
    loading: false,
};

const handleErrors = (error, dispatch, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch(setAlert({ text: errorMessage, color: 'error' }));
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const getAlldesign = createAsyncThunk(
    "design/getAlldesign",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/alldesigns`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.Design;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const createDesign = createAsyncThunk(
    'createDesign/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('userId', data.userId);
            formData.append('description', data.description);

            data.images.forEach((file) => {
                formData.append('images', file); // Append each file
            });

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            const response = await axios.post(`${BASE_URL}/createDesign`, formData, config);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return response.data;
        }
        catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
)

export const getdesignById = createAsyncThunk(
    'users/getUserById',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/getdesignById/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAlldesign());
            return response.data.Design;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

const designSlice = createSlice({
    name: 'design',
    initialState: initialStateDesign,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAlldesign.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching users...';
            })
            .addCase(getAlldesign.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'Users fetched successfully';
                state.allDesign = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAlldesign.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch users';
            })
            .addCase(createDesign.pending, (state) => {
                state.loading = true;
                state.message = 'Adding user...';
            })
            .addCase(createDesign.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allDesign.push(action.payload);
                state.message = action.payload?.message || 'User added successfully';
            })
            .addCase(createDesign.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add user';
            })
            .addCase(getdesignById.pending, (state) => {
                state.loading = true;
                state.message = 'Getting user...';
            })
            .addCase(getdesignById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allDesign = action.payload;
            })
            .addCase(getdesignById.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to get user';
            })
    }
});

export default designSlice.reducer;