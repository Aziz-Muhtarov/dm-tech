"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchCart } from "@/redux/cartThunks";
import CartModal from "./CartModal";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import s from "./CartWidget.module.scss";

export default function CartWidget() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const totalItems = useSelector((state: RootState) => {
    return (state.cart?.items ?? []).reduce((sum, item) => sum + item.quantity, 0);
  });

  useEffect(() => {
    dispatch(fetchCart() as any);
  }, [dispatch]);

  return (
    <div className={s.cartWidget}>
      <IconButton onClick={() => setIsOpen(true)} color="primary">
          <Image src="/basket.svg" alt="cart" width={20} height={20}/>
      </IconButton>
      <span className={s.totalPrice}> Корзина ({totalItems})</span>

      {/* Модальное окно корзины */}
      {isOpen && <CartModal onClose={() => setIsOpen(false)} />}
    </div>
  );
}