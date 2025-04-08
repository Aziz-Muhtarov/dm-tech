import React from 'react';
import { useRouter } from 'next/navigation';
import s from './styles.module.scss';

interface OrderCardProps {
  id: string;
  date: string;
  totalAmount: number;
  items: { id: number; title: string; quantity: number; price: number }[];
}

const OrderCard: React.FC<OrderCardProps> = ({ id, date, totalAmount, items }) => {
  const router = useRouter();

const handleClick = () => {
    router.push(`/order/${encodeURIComponent(id)}`); // передаём createdAt в URL
  };

  return (
    <div className={s.orderCard} onClick={handleClick}>
      <h3>Заказ #{id}</h3>
      <p>Дата: {date}</p>
      <p>Итого: {totalAmount.toLocaleString('ru-RU')} ₽</p>
      <p>Количество товаров: {items.length}</p>
    </div>
  );
};

export default OrderCard;