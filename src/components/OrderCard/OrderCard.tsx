import React from 'react';
import { useRouter } from 'next/navigation';
import s from './styles.module.scss';

interface OrderCardProps {
  id: string;
  totalAmount: number;
  items: {
    id: number;
    title: string;
    quantity: number;
    price: number;
    picture: string;
  }[];
}

const OrderCard: React.FC<OrderCardProps> = ({ id, totalAmount, items }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/orders/${formattedDate}`);
  };

  const formattedDate = new Date(id).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).replace(/(^\d{2}\s)([а-я]+)/, (_, d, m) => d + m.charAt(0).toUpperCase() + m.slice(1));

  return (
    <div className={s.orderCard} onClick={handleClick}>
      <div className={s.orderHeader}>
      <span className={s.orderTitle}>Заказ</span>
      <span className={s.orderNumber}>{new Date(id).getTime()}</span>
      </div>

      <div className={s.images}>
        {items.map((item) => (
          <img
            key={item.id}
            src={item.picture}
            alt={item.title}
            className={s.image}
          />
        ))}
      </div>
      <div className={s.orderDetails}>
        <p>Оформлено <strong>{formattedDate}</strong></p>
        <p>На сумму <strong>{totalAmount.toLocaleString('ru-RU')} ₽</strong></p>
      </div>
    </div>
  );
};

export default OrderCard;