import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store"; // Подключи правильный импорт для типа RootState
import { addToCart, removeFromCart, updateQuantity, clearCart } from "./cartSlice";

// Тип для одного товара в корзине
export interface CartItem {
  id: number;
  title: string;  
  picture: string;
  quantity: number;
  price: number;
  // description?: string;
  // category?: string;
  // rating?: number;
}

// Тип для ответа с сервера (состояние корзины)
export interface CartResponse {
  items: CartItem[];
  totalAmount: number;
}

export const fetchCart = createAsyncThunk<CartResponse>("cart/fetchCart", async () => {
  const cartResponse = await fetch("https://skillfactory-task.detmir.team/cart", {
    method: "GET",
    credentials: "include",
  });

  if (!cartResponse.ok) throw new Error("Ошибка при загрузке корзины");

  const cartData = await cartResponse.json();
  console.log("📦 Данные корзины с сервера:", cartData);

  // Проверяем, есть ли товары в корзине
  if (!cartData.length) {
    console.warn("⚠️ Корзина пустая, не загружаем товары");
    return { items: [], totalAmount: 0 };
  }

  // Запрашиваем информацию о товарах
  const productPromises = cartData.map(async (item: any) => {
    console.log(`📡 Запрашиваем товар: ${item.product.id}`);
    
    const productResponse = await fetch(`https://skillfactory-task.detmir.team/products/${item.product.id}`);

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
      // description: product.description,  
      // category: product.category,        
      // rating: product.rating    
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
          id: item.id.toString(),  // ID товара как строка
          quantity: item.quantity,  // Количество товара
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
        console.error("Ошибка при отправке данных на сервер:", errorData);
        throw new Error(errorData.error || "Ошибка при обновлении корзины");
      }
      
      // Возвращаем актуальные данные корзины
      return response.json(); // Вернем CartResponse, который содержит items и totalAmount
    }
  );

// ✅ Оформление заказа и очистка корзины
export const submitOrder = createAsyncThunk<void, void, { dispatch: any }>(
  "cart/submitOrder",
  // async (_, { dispatch }) => {
  //   const response = await fetch("https://skillfactory-task.detmir.team/cart/submit", {
  //     method: "POST",
  //   });

  //   // лог для отладки:
  //   const responseData = await response.json();
  //   console.log("📦 Ответ от /cart/submit:", responseData);

  //   if (!response.ok) throw new Error("Ошибка при оформлении заказа");
  //   dispatch(clearCart()); // Очистка корзины после успешного оформления

  async (_, { dispatch, getState }) => {
    const state: RootState = getState() as RootState;
    const items = state.cart.items; 

    // Формируем правильный payload для отправки на сервер
    const payload = {
      data: items.map((item: CartItem) => ({
        id: item.id.toString(),  // ID товара как строка
        quantity: item.quantity,  // Количество товара
      }))
    };

    console.log("🔍 Payload для отправки на сервер (submitOrder):", payload);

    const response = await fetch("https://skillfactory-task.detmir.team/cart/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include", // Убедись, что авторизация и cookies включены
    });

    const responseData = await response.json();
    console.log("📦 Ответ от /cart/submit:", responseData);

    if (!response.ok) throw new Error("Ошибка при оформлении заказа");

    // Очистить корзину после успешного оформления
    dispatch(clearCart());
  }
);