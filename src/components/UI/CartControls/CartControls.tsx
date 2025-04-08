"use client";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addToCart, updateQuantity, removeFromCart } from "@/redux/cartSlice";
import type { CartItem } from "@/redux/cartThunks";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import Image from 'next/image';
import s from "./styles.module.scss";

interface CartControlsProps {
  productId: number;
  price: number;
  title: string;
  picture: string;
  quantity?: number;
  hideAddButton?: boolean;
  showCheckoutButton?: boolean;
  allowRemove?: boolean;
  forceShowAddButton?: boolean;
  mode?: "inline" | "modal";
}

const CartControls = ({
  productId,
  price,
  title,
  picture,
  hideAddButton = false,
  showCheckoutButton = false,
  allowRemove = false,
  forceShowAddButton = false,
  mode,
}: CartControlsProps) => {
  const dispatch = useDispatch();

  // Получаем товар из корзины
  const cartItem = useSelector((state: RootState) =>
    state.cart?.items?.find((item) => item.id === productId)
  );

  const quantity = useSelector(
    (state: RootState) =>
      state.cart.items.find((item) => item.id === productId)?.quantity || 0
  );

  const handleAddToCart = () => {
    dispatch(addToCart({ id: productId, title, picture, price, quantity: 1 }));
  };

  const handleIncrease = () => {
    const maxQuantityReached = quantity >= 10;
    const maxTotalReached = totalAmount + price > 10_000;
  
    if (maxQuantityReached || maxTotalReached) return;
  
    dispatch(updateQuantity({ id: productId, quantity: quantity + 1 }));
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      dispatch(updateQuantity({ id: productId, quantity: quantity - 1 }));
    } else if (quantity === 1 && allowRemove) {
      dispatch(updateQuantity({ id: productId, quantity: 0 }));
    }
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(productId));
  };

  // Лимит на заказ количества товаров в корзине
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);

  // Функция для отправки заказа на сервер
  const handleCheckout = async () => {
    try {
      // Получаем все товары в корзине
      const items: CartItem[] = useSelector((state: RootState) => state.cart.items);
      
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          title: item.title,
          picture: item.picture
        })),
        totalAmount: totalAmount
      };

      const response = await axios.post("https://skillfactory-task.detmir.team/orders", orderData);
      if (response.status === 200) {
        alert("Заказ оформлен успешно");
        // Очистить корзину после успешного оформления
        dispatch(removeFromCart(productId)); // Удаляем конкретный товар или все товары, если необходимо
      } else {
        alert("Ошибка при оформлении заказа");
      }
    } catch (error) {
      alert("Ошибка при оформлении заказа");
    }
  };

  return (
    <div className={s.cartControls}>
      {quantity === 0 && mode === "inline" ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          className={s.addButton}
        >
          Добавить в корзину
        </Button>
      ) : (
        <div className={s.quantityWrapper}>
          <Button
            onClick={handleDecrease}
            size="small"
            className={s.quantityButton}
            disabled={quantity <= 1 && !allowRemove}
          >
            <RemoveIcon />
          </Button>
          <span className={s.quantity}>{quantity}</span>
          <Tooltip
            title={
              quantity >= 10
                ? "Нельзя больше 10 штук одного товара"
                : totalAmount + price > 10_000
                ? "Сумма заказа не может превышать 10 000 ₽"
                : ""
            }
            disableHoverListener={quantity < 10 && totalAmount + price <= 10_000}
            arrow
          >
            <span>
              <Button
                onClick={handleIncrease}
                size="small"
                className={s.quantityButton}
                disabled={quantity >= 10 || totalAmount + price > 10_000}
              >
                <AddIcon />
              </Button>
            </span>
          </Tooltip>
        </div>
      )}

      {showCheckoutButton && quantity > 0 && (
        <Button
          variant="contained"
          color="secondary"
          className={s.checkoutButton}
          onClick={handleCheckout}
        >
          Оформить заказ
        </Button>
      )}

      {allowRemove && quantity === 0 && mode === "modal" && (
        <Button
          variant="text"
          color="error"
          onClick={handleRemoveFromCart}
          className={s.removeButton}
        >
          <Image src="/remove.svg" alt="Удалить" width={16} height={16} className={s.image}/>
          Удалить
        </Button>
      )}
    </div>
  );
};

export default CartControls;
