import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
// My imports.
import type { Cart } from "../../models/cart";
import agent from "../../api/agent";
import getCookie from "../../util/cookie";

interface CartState {
  cart: Cart | null;
  status: string;
}

const initialState: CartState = {
  cart: null,
  status: "idle",
};

export const fetchCartAsync = createAsyncThunk<Cart>(
  "cart/fetchCartAsync",
  async (_, thunkApi) => {
    try {
      return await agent.Cart.get();
    } catch (e: any) {
      return thunkApi.rejectWithValue({ error: e.data });
    }
  },
  {
    condition: () => {
      if (!getCookie("buyerId")) {
        return false;
      }
    },
  }
);

export const addCartItemAsync = createAsyncThunk<
  Cart,
  { productId: number; quantity?: number }
>("cart/addCartItemAsync", async ({ productId, quantity = 1 }, thunkApi) => {
  try {
    return await agent.Cart.addItem(productId, quantity);
  } catch (e: any) {
    return thunkApi.rejectWithValue({ error: e.data });
  }
});

export const removeCartItemAsync = createAsyncThunk<
  void,
  { productId: number; quantity: number; name?: string }
>("cart/removeCartItemAsync", async ({ productId, quantity }, thunkApi) => {
  try {
    return await agent.Cart.removeItem(productId, quantity);
  } catch (e: any) {
    console.log(e);
    return thunkApi.rejectWithValue({ error: e.data });
  }
});

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state: CartState, action: any) => {
      state.cart = action.payload;
    },
    clearCart: (state) => {
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addCartItemAsync.pending, (state, action) => {
      state.status = "pendingAddItem" + action.meta.arg.productId;
    });
    builder.addCase(addCartItemAsync.fulfilled, (state, action) => {
      state.cart = action.payload;
      state.status = "idle";
    });
    builder.addCase(addCartItemAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addCase(removeCartItemAsync.pending, (state, action) => {
      state.status =
        "pendingRemoveItem" + action.meta.arg.productId + action.meta.arg.name;
    });
    builder.addCase(removeCartItemAsync.fulfilled, (state, action) => {
      const { productId, quantity } = action.meta.arg;
      if (state.cart !== null) {
        const itemIndex = state.cart.items.findIndex(
          (i) => i.productId === productId
        );
        if (itemIndex === -1 || itemIndex === undefined) {
          return;
        }
        state.cart.items[itemIndex].quantity -= quantity;
        if (state.cart.items[itemIndex].quantity < 1) {
          state.cart.items.splice(itemIndex, 1);
        }
        state.status = "idle";
      }
    });
    builder.addCase(removeCartItemAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addMatcher(
      isAnyOf(addCartItemAsync.fulfilled, fetchCartAsync.fulfilled),
      (state, action) => {
        state.cart = action.payload;
        state.status = "idle";
      }
    );
    builder.addMatcher(
      isAnyOf(addCartItemAsync.rejected, fetchCartAsync.rejected),
      (state, action) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
  },
});

export const { setCart, clearCart } = cartSlice.actions;
