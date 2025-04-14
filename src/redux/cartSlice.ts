// Импортируем нужные утилиты из Redux Toolkit и асинхронные thunk-функции для работы с корзиной
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCart, submitOrder, CartResponse } from "./cartThunks";

// Структура одного товара в корзине
interface CartItem {
  id: number;
  title: string;
  picture: string;
  quantity: number;
  price: number;
}


// Определяем начальное состояние корзины
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

// Создаём slice для корзины: включает редьюсеры и обработку асинхронных thunk'ов
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Добавление товара в корзину (или увеличение количества, если уже есть)
    addToCart: (state, action: PayloadAction<{ id: number; title: string; picture: string; price: number, quantity: number }>) => {
        if (!state.items) {
            state.items = [];
          }
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({
          id: action.payload.id,
          title: action.payload.title,
          picture: action.payload.picture,
          price: action.payload.price,
          quantity: action.payload.quantity,
        });
      }
      // Пересчёт общей суммы
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    // Удаление товара из корзины по id
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    // Обновление количества конкретного товара
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity = action.payload.quantity;
      }
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    // Очистка всей корзины
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
  // Обработка асинхронных действий fetchCart и submitOrder
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

// Экспорт действий и редьюсера корзины
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;