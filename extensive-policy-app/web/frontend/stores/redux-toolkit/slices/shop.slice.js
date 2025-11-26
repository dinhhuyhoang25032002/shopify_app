import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
export const fetchShopInfo = createAsyncThunk(
    "shop/fetchShopInfo",
    async (handleFetchApi, thunkAPI) => {
        try {
            const response = await handleFetchApi("shop"); // đổi URL theo API của bạn
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Error server");
        }
    }
);
const initialState = {
    id: '',
    shop: "",
    email: "",
    first_name: "",
    last_name: "",
    sender_email: "",
    status: "",
    loading: null,
    error: null,
}
const shopSlice = createSlice({
    name: 'shop',
    initialState: initialState,
    reducers: {
        setShop(state, action) {
            return { ...state, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShopInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(fetchShopInfo.fulfilled, (state, action) => {
                return {
                    ...state,
                    ...action.payload,
                    loading: false
                };
            }).addCase(fetchShopInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})
export const { setShop } = shopSlice.actions
export default shopSlice.reducer