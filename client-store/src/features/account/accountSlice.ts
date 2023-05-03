import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
// My imports.
import type { User } from "../../models/user";
import agent from "../../api/agent";
import router from "../../router/Routes";
import { setCart } from "../cart/cartSlice";

interface AccountState {
  user: User | null;
}

const initialState: AccountState = {
  user: null,
};

export const signInUser = createAsyncThunk<User, FieldValues>(
  "account/signInUser",
  async (data, thunkAPI) => {
    try {
      const userDto = await agent.Account.login(data);
      const { cart, ...user } = userDto;
      if (cart) {
        thunkAPI.dispatch(setCart(cart));
      }
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (e: any) {
      return thunkAPI.rejectWithValue({ error: e.data });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<User>(
  "account/fetchCurrentUser",
  async (_, thunkAPI) => {
    const userStorage = localStorage.getItem("user") as string;
    thunkAPI.dispatch(setUser(JSON.parse(userStorage)));
    try {
      const userDto = await agent.Account.currentUser();
      const { cart, ...user } = userDto;
      if (cart) {
        thunkAPI.dispatch(setCart(cart));
      }
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (e: any) {
      return thunkAPI.rejectWithValue({ error: e.data });
    }
  },
  {
    condition: () => {
      if (!localStorage.getItem("user")) {
        // Only call the api if we have a token.
        return false;
      }
    },
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      router.navigate("/");
    },
    setUser: (state, action) => {
      const claims = JSON.parse(atob(action.payload.token.split(".")[1]));
      const roles =
        claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      state.user = {
        ...action.payload,
        roles: typeof roles === "string" ? [roles] : roles,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");
      toast.error("Session expired - please login again");
      router.navigate("/");
    });
    builder.addMatcher(
      isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
      (state, action) => {
        const claims = JSON.parse(atob(action.payload.token.split(".")[1]));
        const roles =
          claims[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        state.user = {
          ...action.payload,
          roles: typeof roles === "string" ? [roles] : roles,
        };
      }
    );
    builder.addMatcher(isAnyOf(signInUser.rejected), (_, action) => {
      throw action.payload;
    });
  },
});

export const { signOut, setUser } = accountSlice.actions;
