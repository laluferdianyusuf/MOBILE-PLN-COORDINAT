import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { History, HistoryResponse, HistoryState } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uri } from "@/utils/uri";

// create history
export const generateHistory = createAsyncThunk<
  HistoryResponse,
  { id: string; data: History }
>("generate/history", async ({ id, data }, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.post(
      `${uri}/api/v2/generate/history/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

// get all history by user id
export const getAllHistoryByUserId = createAsyncThunk<
  HistoryResponse,
  { id: string }
>("get/all-history/user-id", async ({ id }, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${uri}/api/v2/retrieve/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

// get all history by category
export const getAllHistoryByCategory = createAsyncThunk<
  HistoryResponse,
  { id: string }
>("get/all-history/category", async ({ id }, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${uri}/api/v2/retrieve/category/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data);
  }
});

// delete history
export const deleteHistory = createAsyncThunk(
  "history/deleteHistory",
  async ({ data }: { data: string[] }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.delete(`${uri}/api/v2/destroy`, {
        data: { ids: data },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState: HistoryState = {
  histories: [],
  loading: false,
  error: null,
};

const historySlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // generate history
      .addCase(generateHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.histories = action.payload.data.history || [];
      })
      .addCase(generateHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //   get all history by user id
      .addCase(getAllHistoryByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHistoryByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.histories = action.payload.data.history || [];
      })
      .addCase(getAllHistoryByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //   get all history by category
      .addCase(getAllHistoryByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHistoryByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.histories = action.payload.data.history || [];
      })
      .addCase(getAllHistoryByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //   delete history
      .addCase(deleteHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHistory.fulfilled, (state, action) => {
        state.loading = false;
        const deletedIds = action.meta.arg.data;
        state.histories = state.histories.filter(
          (item) =>
            item.id !== undefined && !deletedIds.includes(String(item.id))
        );
      })
      .addCase(deleteHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default historySlice.reducer;
