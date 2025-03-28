"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromCart, clearCart } from "@/redux/cartSlice";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import s from "./CartModal.module.scss";

interface CartModalProps {
  onClose: () => void;
}

export default function CartModal({ onClose }: CartModalProps) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart?.items ?? []);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount); // Изменено с total

  return (
    <Modal open={true} onClose={onClose} className={s.modal}>
      <div className={s.modalContent}>
        <h2>Корзина</h2>
        {cartItems.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            <ul className={s.cartList}>
              {cartItems.map((item) => (
                <li key={item.id} className={s.cartItem}>
                  <span>{item.id} x {item.quantity}</span> {/* Используем id, чтобы не потерять ключ */}
                  <span>{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</span>
                  <Button size="small" color="error" onClick={() => dispatch(removeFromCart(item.id))}>
                    Удалить
                  </Button>
                </li>
              ))}
            </ul>
            <div className={s.cartFooter}>
              <strong>Итого: {totalAmount.toLocaleString("ru-RU")} ₽</strong>
              <Button variant="contained" color="primary" onClick={() => { dispatch(clearCart()); onClose(); }}>
                Оформить заказ
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}