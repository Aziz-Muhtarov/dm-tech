"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { clearCart } from "@/redux/cartSlice";
import { submitOrder, updateCartOnServer } from "@/redux/cartThunks";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Image from "next/image";
import CartControls from "@/components/UI/CartControls/CartControls";
import s from "./CartModal.module.scss";

interface CartModalProps {
  onClose: () => void;
}

export default function CartModal({ onClose }: CartModalProps) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart?.items ?? []);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);

  return (
    <Modal open={true} onClose={onClose} className={s.modal}>
      <div className={s.modalContent}>
        {cartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            <ul className={s.cartList}>
              {cartItems.map((item) => (
                <li key={item.id} className={s.cartItem}>
                  {/* Проверяем, есть ли изображение */}
                  {item.picture ? (
                    <Image
                      src={item.picture}
                      alt={item.title}
                      width={52}
                      height={52}
                      className={s.productImage}
                    />
                  ) : (
                    <Image
                      src="/https://placehold.co/52x52"
                      alt="Нет изображения"
                      width={52}
                      height={52}
                      className={s.productImage}
                    />
                  )}

                  {/* Название товара */}
                  <div className={s.productInfo}>
                    <span className={s.productName}>{item.title}</span>
                  </div>

                  {/* Кнопки управления количеством */}
                  <CartControls
                      productId={item.id}
                      price={item.price}
                      title={item.title}
                      picture={item.picture}
                      hideAddButton={true}
                      showCheckoutButton={false}
                      allowRemove={true}
                      mode="modal"
                    />
                    
                    {/* Стоимость текущего товара */}
                    {item.quantity > 0 ? (
                      <div className={s.productPrice}>
                        {item.quantity > 1 && (
                          <span className={s.unitPrice}>
                            {item.price.toLocaleString("ru-RU")} ₽ за 1 шт.
                          </span>
                        )}
                        <span className={s.totalPrice}>
                          {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                    ) : null}
                  
                </li>
              ))}
            </ul>

            <div className={s.cartFooter}>
              <strong className={s.totalAmount}>Итого <span className={s.amount}>{totalAmount.toLocaleString("ru-RU")} ₽</span></strong>
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  try {
                    await dispatch(updateCartOnServer() as any); // Обновляем корзину на сервере
                    await dispatch(submitOrder() as any);        // Только потом оформляем заказ
                    onClose();                                   // Закрываем окно
                  } catch (error) {
                    console.error("Ошибка при оформлении заказа", error);
                  }
                }}
              >
                Оформить заказ
              </Button>

              {/* <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  try {
                    // Собираем данные заказа
                    const orderData = { 
                      items: cartItems.map(item => ({
                        id: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        title: item.title,
                        picture: item.picture
                      })),
                      totalAmount: totalAmount
                    };

                    // Отправляем заказ на сервер
                    const response = await axios.post("https://skillfactory-task.detmir.team/cart/submit", orderData);
                      if (cartItems.length === 0) {
                        alert("Корзина пуста. Пожалуйста, добавьте товары в корзину.");
                        return;
                      }

                    if (response.status === 200) {
                      console.log("Ответ от сервера:", response.data); // Проверь ответ
                      alert("Заказ оформлен успешно");

                      // Очистка корзины после оформления заказа
                      dispatch(clearCart()); 

                      // Закрытие модального окна
                      onClose(); 
                    } else {
                      alert("Ошибка при оформлении заказа");
                    }
                  } catch (error) {
                    alert("Ошибка при оформлении заказа");
                    console.error(error);
                  }

                  const orderData = cartItems.map(item => ({
                    product: {
                      id: item.id,  // Уникальный ID товара
                      title: item.title,  // Название товара
                      description: item.description || "",  // Описание товара, если есть
                      category: item.category || "",  // Категория товара, если есть
                      price: item.price,  // Цена товара
                      picture: item.picture,  // URL изображения товара
                      rating: item.rating || 0  // Рейтинг товара, если есть
                    },
                    quantity: item.quantity  // Количество товара
                  }));
                  
                  try {
                    const response = await axios.post("https://skillfactory-task.detmir.team/cart/submit", orderData, {
                      headers: {
                        'Accept': 'application/json',
                      }
                    });
                  
                    if (response.status === 200) {
                      console.log("Ответ от сервера:", response.data);
                      alert("Заказ оформлен успешно");
                      dispatch(clearCart()); // Очистить корзину после оформления заказа
                      onClose(); // Закрыть модальное окно
                    } else {
                      alert("Ошибка при оформлении заказа");
                    }
                  } catch (error) {
                    alert("Ошибка при оформлении заказа");
                    console.error(error);
                  }
                }}
              >
                Оформить заказ
              </Button> */}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}