import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  MultiUserResponse,
  User,
  UserResponse,
  UserState,
} from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uri } from "@/utils/uri";

// Helper: Save token
const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("token", token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

// Helper: Remove token
const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("token");
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

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
      const token = response.data?.data?.token;
      if (token) await saveToken(token);
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
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${uri}/api/v1/current/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        await removeToken();
      }
      return rejectWithValue(error.response?.data);
    }
  }
);

// log out
export const logout = createAsyncThunk<void, void>(
  "admin/logout",
  async (_, { rejectWithValue }) => {
    try {
      await removeToken();
    } catch (error: any) {
      return rejectWithValue("Failed to log out");
    }
  }
);

// Change password
export const changePassword = createAsyncThunk<
  UserResponse,
  {
    id: string;
    currentPassword: string;
    password: string;
    reTypePassword: string;
  },
  { rejectValue: string }
>("user/changePassword", async (data, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.put(
      `${uri}/api/v1/change/password/${data.id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Change password failed"
    );
  }
});

// Update url
export const updateUrl = createAsyncThunk<
  UserResponse,
  {
    id: string;
    url: string;
  },
  { rejectValue: string }
>("user/updateUrl", async (data, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.put(
      `${uri}/api/v1/update/url/${data.id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Change password failed"
    );
  }
});

// Get all users
export const getAllUsers = createAsyncThunk<MultiUserResponse, void>(
  "all/users",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(`${uri}/api/v1/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        await removeToken();
      }
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState: UserState = {
  users: null,
  allUsers: [],
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
      })

      // change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data.user;

        const token = action.payload.data.token;
        if (token) {
          AsyncStorage.setItem("token", token).catch((error) =>
            console.error("Error saving token:", error)
          );
        }
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to change password";
      })

      // update url
      .addCase(updateUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data.user;
      })
      .addCase(updateUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add url";
      })

      // All users states
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload.data.user;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateProfileField } = authSlice.actions;
export default authSlice.reducer;
