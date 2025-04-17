import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User, UserResponse, UserState } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uri } from "@/utils/uri";

// register user
export const register = createAsyncThunk<UserResponse, User>(
  "user/registrations",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${uri}/api/v1/register/user`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// login
export const login = createAsyncThunk<UserResponse, User>(
  "login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${uri}/api/v1/login`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get current user
export const currentUser = createAsyncThunk<UserResponse, void>(
  "current/user",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(`${uri}/api/v1/current/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// log out
export const logout = createAsyncThunk<void, void>(
  "admin/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem("token");
    } catch (error: any) {
      return rejectWithValue("Failed to log out");
    }
  }
);

const initialState: UserState = {
  users: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    updateProfileField: (
      state,
      action: PayloadAction<{ field: keyof User; value: string }>
    ) => {
      (state as any)[action.payload.field] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      // Registration user states
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login states
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data.user;
        state.token = action.payload.data.token || "";
        if (state.token) {
          AsyncStorage.setItem("token", state.token).catch((error) =>
            console.error("Error saving token:", error)
          );
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Current user states
      .addCase(currentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(currentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data.user;
      })
      .addCase(currentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // logout states
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.users = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("Logout error:", action.payload);
      });
  },
});

export const { updateProfileField } = authSlice.actions;
export default authSlice.reducer;
