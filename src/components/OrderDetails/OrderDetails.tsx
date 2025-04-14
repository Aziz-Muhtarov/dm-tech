'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import s from './styles.module.scss';
import CartControls from "@/components/UI/CartControls/CartControls";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";

interface OrderDetailsProps {
  params: { id: string };
}

export default function OrderDetails({ params }: OrderDetailsProps) {
    console.log("params.id:", params.id);  // Логируем id
    const orderDateKey = new Date(Number(params.id));
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://skillfactory-task.detmir.team/orders', {
            withCredentials: true,
        });
        const filteredItems = response.data.data.filter((item: any) => {
          const orderDate = new Date(item.createdAt);
          const orderDateString = orderDate.toLocaleDateString('ru-RU');
        //   return orderDateString === orderDateKey;
        console.log("orderDateKey:", orderDateKey);
        return new Date(item.createdAt).getTime() === orderDateKey.getTime();
        
        });
        if (filteredItems.length > 0) {
          setOrderItems(filteredItems);
        } else {
          setError('Заказ не найден');
        }
      } catch {
        setError('Ошибка загрузки заказа');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orderDateKey]);

  const handleRepeatOrder = () => {
    orderItems.forEach((item: any) => {
      dispatch(addToCart({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        picture: item.product.picture,
        quantity: item.quantity || 1,
      }));
    });
  };

  // Вычисляем общую сумму с учетом всех товаров
  const totalAmount = orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={s.orderDetails}>
      <h1>Заказ от {orderDateKey.toLocaleDateString('ru-RU')}</h1>
      <p>Итого: {totalAmount.toLocaleString('ru-RU')} ₽</p>
      <div className={s.items}>
        {orderItems.map((item, index) => (
          <div key={index} className={s.item}>
            <p>{item.product.title}</p>
            <p>Цена: {item.product.price.toLocaleString('ru-RU')} ₽</p>
            <p>Количество: {item.quantity}</p>
            <CartControls
              productId={item.product.id}
              price={item.product.price}
              title={item.product.title}
              picture={item.product.picture}
              hideAddButton={false}
              showCheckoutButton={true}
              allowRemove={false}
              mode="inline"
            />
          </div>
        ))}
      </div>
      <button onClick={handleRepeatOrder} className={s.repeatOrderButton}>
        Повторить заказ
      </button>
    </div>
  );
}