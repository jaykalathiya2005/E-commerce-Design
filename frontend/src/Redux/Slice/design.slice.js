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
            formData.append('price', data.price);

            data.images.forEach((file) => {
                formData.append('images', file); // Append each file
            });

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            }
            const response = await axios.post(`${BASE_URL}/createDesign`, formData, config);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAlldesign());
            return response.data;
        }
        catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
)

export const getdesignById = createAsyncThunk(
    'users/getdesignById',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.get(`${BASE_URL}/getdesignById/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            // dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAlldesign());
            return response.data.Design;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

export const deleteDesign = createAsyncThunk(
    'Design/delete',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const token = await sessionStorage.getItem("token");
            const response = await axios.delete(BASE_URL + `/designdelete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            return id;
        } catch (error) {
            return handleErrors(error, dispatch, rejectWithValue);
        }
    }
);

// export const editDesign = createAsyncThunk(
//     'Design/edit',
//     async (data, { dispatch, rejectWithValue }) => {
//         try {
//             const { _id, ...rest } = data;
//             const formData = new FormData();
//             formData.append('title', rest.title);
//             formData.append('userId', rest.userId);
//             formData.append('description', rest.description);
//             formData.append('price', data.price);

//             rest.images.forEach((file) => {
//                 formData.append('images', file); // Append each file
//             });

//             const token = await sessionStorage.getItem("token");
//             const response = await axios.put(BASE_URL + `/updatedesign/${_id}`, formData, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'multipart/form-data',
//                 }
//             });
//             dispatch(setAlert({ text: response.data.message, color: 'success' }));
//             dispatch(getAlldesign());
//             return response.data;
//         } catch (error) {
//             return handleErrors(error, dispatch, rejectWithValue);
//         }
//     }
// );

export const editDesign = createAsyncThunk(
    'edit/Design',
    async (productData, { dispatch, rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('price', productData.price);
            formData.append('userId', productData.userId);
            formData.append('description', productData.description);
            formData.append('title', productData.title);

            const existingImages = [];
            if (Array.isArray(productData.images)) {
                productData.images.forEach((imgItem) => {
                    if (typeof imgItem === 'string') {
                        existingImages.push(imgItem);
                    } else if (imgItem instanceof FileList) {
                        for (let i = 0; i < imgItem.length; i++) {
                            formData.append('images', imgItem[i]);
                        }
                    } else if (imgItem instanceof File) {
                        formData.append('images', imgItem);
                    }
                });
            }

            formData.append('existingImages', JSON.stringify(existingImages));

            for (let pair of formData.entries()) {
                // console.log(`${pair[0]}:`, pair[1]);
            }
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

            const response = await axios.put(BASE_URL + `/updatedesign/${productData._id}`, formData, config);
            console.log('All responses:', response.data);
            dispatch(setAlert({ text: response.data.message, color: 'success' }));
            dispatch(getAlldesign());
            return response.data;
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
            // Get design
            .addCase(getAlldesign.pending, (state) => {
                state.loading = true;
                state.message = 'Fetching design...';
            })
            .addCase(getAlldesign.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = 'design fetched successfully';
                state.allDesign = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getAlldesign.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to fetch design';
            })
            // Add design
            .addCase(createDesign.pending, (state) => {
                state.loading = true;
                state.message = 'Adding design...';
            })
            .addCase(createDesign.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allDesign.push(action.payload);
                state.message = action.payload?.message || 'design added successfully';
            })
            .addCase(createDesign.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to add design';
            })
            // get design by id
            .addCase(getdesignById.pending, (state) => {
                state.loading = true;
                state.message = 'Getting design...';
            })
            .addCase(getdesignById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currDesign = action.payload;
            })
            .addCase(getdesignById.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to get design';
            })
            // Delete design
            .addCase(deleteDesign.pending, (state) => {
                state.loading = true;
                state.message = 'Deleting design...';
            })
            .addCase(deleteDesign.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allDesign = state.allDesign.filter((v) => v._id !== action.payload);
                state.message = action.payload?.message || 'design deleted successfully';
            })
            .addCase(deleteDesign.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to delete design';
            })
            // Edit design
            .addCase(editDesign.pending, (state) => {
                state.loading = true;
                state.message = 'Editing design...';
            })
            .addCase(editDesign.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.allDesign = state.allDesign.map((v) =>
                    v._id === action.payload._id ? action.payload : v
                );
                state.message = action.payload?.message || 'design updated successfully';
            })
            .addCase(editDesign.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload?.message || 'Failed to update design';
            });
    }
});

export default designSlice.reducer;