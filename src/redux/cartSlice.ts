import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCart, updateCartOnServer, submitOrder, CartResponse } from "./cartThunks";

interface CartItem {
  id: number;
  title: string;
  picture: string;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
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
    addToCart: (state, action: PayloadAction<{ id: number; title: string; picture: string; price: number, quantity: number }>) => {
        if (!state.items) {
            state.items = []; // Если вдруг items оказался undefined
          }
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity; // Увеличиваем количество товара в корзине
      } else {
        state.items.push({
          id: action.payload.id,
          title: action.payload.title,
          picture: action.payload.picture,
          price: action.payload.price,
          quantity: action.payload.quantity,
        });
      }
      console.log("Корзина после добавления:!!!!!!!!!!", state.items);
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
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartResponse>) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.status = "idle";
      })
      .addCase(fetchCart.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.items = [];
        state.totalAmount = 0;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;