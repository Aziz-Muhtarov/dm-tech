import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCart, updateCartOnServer, submitOrder } from "./cartThunks";

interface CartState {
  items: { id: number; quantity: number; price: number }[];
  totalAmount: number;
  status: "idle" | "loading" | "failed";
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  status: "idle",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ id: number; price: number }>) => {
        if (!state.items) {
            state.items = []; // Если вдруг items оказался undefined
          }
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ id: action.payload.id, quantity: 1, price: action.payload.price });
      }
      console.log("Корзина после добавления:", state.items);
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity = action.payload.quantity;
      }
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.status = "idle";
      })
      .addCase(fetchCart.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateCartOnServer.fulfilled, (state) => {
        // Здесь не обновляем items и totalAmount, так как они не возвращаются
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.items = [];
        state.totalAmount = 0;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;