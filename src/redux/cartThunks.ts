import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store"; 
import { clearCart } from "./cartSlice";

// Тип для одного товара в корзине
export interface CartItem {
  id: number;
  title: string;  
  picture: string;
  quantity: number;
  price: number;
}

// Тип для ответа с сервера (состояние корзины)
export interface CartResponse {
  items: CartItem[];
  totalAmount: number;
}

// 🔽 Загрузка корзины с сервера + доп. данные о товарах
export const fetchCart = createAsyncThunk<CartResponse>("cart/fetchCart", async () => {
  const cartResponse = await fetch("https://skillfactory-task.detmir.team/cart", {
    method: "GET",
    credentials: "include",
  });
  if (!cartResponse.ok) throw new Error("Ошибка при загрузке корзины");
  const cartData = await cartResponse.json();

  // Запрашиваем информацию о товарах
  const productPromises = cartData.map(async (item: any) => {
    console.log(`📡 Запрашиваем товар: ${item.product.id}`);
    
    const productResponse = await fetch(`https://skillfactory-task.detmir.team/products/${item.product.id}`, {
      method: "GET",
      credentials: "include",
    });
    if (!productResponse.ok) {
      console.error(`❌ Ошибка при загрузке товара ${item.product.id}`);
      return null;
    }
    return productResponse.json();
  });

  const productsData = await Promise.all(productPromises);

  // Формируем корзину
  const items = cartData.map((item: any, index: number) => {
    const product = productsData[index];
    return {
      id: product.id,
      title: product.title,
      picture: product.picture,
      quantity: item.quantity,
      price: product.price,
    };
  });

  return {
    items,
    totalAmount: items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0),
  };
});

// 🔄 Обновление корзины на сервере
export const updateCartOnServer = createAsyncThunk<CartResponse, void, { state: RootState }>(
    "cart/updateCart",
    async (_, { getState }) => {
      const state = getState();
      const items = state.cart.items;

      // Формируем правильный payload для отправки на сервер
      const payload = {
        data: items.map((item: CartItem) => ({
          id: item.id.toString(), 
          quantity: item.quantity,
        }))
      };
      console.log("🔍 Payload перед отправкой:", JSON.stringify(payload, null, 2));

      const response = await fetch("https://skillfactory-task.detmir.team/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      
      // Обработка ошибки при отправке данных
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при обновлении корзины");
      }
      
      // Возвращаем актуальные данные корзины
      return response.json(); 
    }
  );

// ✅ Оформление заказа и очистка корзины
export const submitOrder = createAsyncThunk<void, void, { dispatch: any }>(
  "cart/submitOrder",
  async (_, { dispatch, getState }) => {
    const state: RootState = getState() as RootState;
    const items = state.cart.items; 

    // Формируем правильный payload для отправки на сервер
    const payload = {
      data: items.map((item: CartItem) => ({
        id: item.id.toString(),
        quantity: item.quantity,
      }))
    };

    const response = await fetch("https://skillfactory-task.detmir.team/cart/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include", 
    });
    if (!response.ok) throw new Error("Ошибка при оформлении заказа");

    // Очистить корзину после успешного оформления
    dispatch(clearCart());
  }
);