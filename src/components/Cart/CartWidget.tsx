"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchCart } from "@/redux/cartThunks";
import CartModal from "./CartModal";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import s from "./CartWidget.module.scss";

export default function CartWidget() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const totalItems = useSelector((state: RootState) => {
    return (state.cart?.items ?? []).reduce((sum, item) => sum + item.quantity, 0);
  });
  const totalAmount = useSelector((state: RootState) => state.cart ? state.cart.totalAmount : 0);

  useEffect(() => {
    dispatch(fetchCart() as any); // ✅ Загружаем корзину при старте
  }, [dispatch]);

  return (
    <div className={s.cartWidget}>
      <IconButton onClick={() => setIsOpen(true)} color="primary">
        <Badge badgeContent={totalItems} color="secondary">
          <ShoppingCartIcon fontSize="large" />
        </Badge>
      </IconButton>
      <span className={s.totalPrice}>{(totalAmount || 0).toLocaleString("ru-RU")} ₽</span>

      {/* Модальное окно корзины */}
      {isOpen && <CartModal onClose={() => setIsOpen(false)} />}
    </div>
  );
}