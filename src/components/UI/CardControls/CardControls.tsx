"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addToCart, updateQuantity, removeFromCart } from "@/redux/cartSlice";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import s from "./styles.module.scss";

interface CartControlsProps {
  productId: number;
  price: number;
}

const CartControls = ({ productId, price }: CartControlsProps) => {
  const dispatch = useDispatch();
  
  // Получаем товар из корзины
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.id === productId)
  );

  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    dispatch(addToCart({ id: productId, price }));
  };

  const handleIncrease = () => {
    dispatch(updateQuantity({ id: productId, quantity: quantity + 1 }));
  };

  const handleDecrease = () => {
    if (quantity === 1) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ id: productId, quantity: quantity - 1 }));
    }
  };

  return (
    <div className={s.cartWrapper}>
      {quantity > 0 ? (
        <div className={s.cartControls}>
          <div className={s.quantityWrapper}>
            <Button onClick={handleDecrease} size="small" className={s.quantityButton}>
              <RemoveIcon />
            </Button>
            <span className={s.quantity}>{quantity}</span>
            <Button onClick={handleIncrease} size="small" className={s.quantityButton}>
              <AddIcon />
            </Button>
          </div>
          <Button variant="contained" color="secondary" className={s.checkoutButton}>
            Оформить заказ
          </Button>
        </div>
      ) : (
        <Button variant="contained" color="primary" onClick={handleAddToCart} className={s.addButton}>
          Добавить в корзину
        </Button>
      )}
    </div>
  );
};

export default CartControls;