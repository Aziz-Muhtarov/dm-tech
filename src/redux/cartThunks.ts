import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store"; // Подключи правильный импорт для типа RootState
import { addToCart, removeFromCart, updateQuantity, clearCart } from "./cartSlice";

// Тип для одного товара в корзине
interface CartItem {
  id: number;
  quantity: number;
  price: number;
}

// Тип для ответа с сервера (состояние корзины)
interface CartResponse {
  items: CartItem[];
  totalAmount: number;
}

// 🛒 Получение состояния корзины с сервера
export const fetchCart = createAsyncThunk<CartResponse>("cart/fetchCart", async () => {
  const response = await fetch("https://skillfactory-task.detmir.team/cart");
  if (!response.ok) throw new Error("Ошибка при загрузке корзины");
  return response.json(); // Возвращаем CartResponse
});

// 🔄 Обновление корзины на сервере
export const updateCartOnServer = createAsyncThunk<CartResponse, void, { state: RootState }>(
    "cart/updateCart",
    async (_, { getState }) => {
      const state = getState();
      const response = await fetch("https://skillfactory-task.detmir.team/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: state.cart.items }),
      });
      if (!response.ok) throw new Error("Ошибка при обновлении корзины");
      
      // Возвращаем актуальные данные корзины
      return response.json(); // Вернем CartResponse, который содержит items и totalAmount
    }
  );

// ✅ Оформление заказа и очистка корзины
export const submitOrder = createAsyncThunk<void, void, { dispatch: any }>(
  "cart/submitOrder",
  async (_, { dispatch }) => {
    const response = await fetch("https://skillfactory-task.detmir.team/cart/submit", {
      method: "POST",
    });
    if (!response.ok) throw new Error("Ошибка при оформлении заказа");
    dispatch(clearCart()); // Очистка корзины после успешного оформления
  }
);