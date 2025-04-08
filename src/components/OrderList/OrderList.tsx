'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import OrderCard from "@/components/OrderCard/OrderCard"; // Компонент для отображения информации о заказе
import Pagination from '@/components/Pagination/Pagination';
import s from './styles.module.scss';

interface Order {
  id: string;
  date: string;
  totalAmount: number;
  items: { id: number; title: string; quantity: number; price: number }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const limit = 8;

  useEffect(() => {
    const fetchOrders = async () => {
        try {
          const response = await axios.get(`https://skillfactory-task.detmir.team/orders?limit=${limit}&page=${page}`);
          
          const totalItems = response.data.meta.total;
          setTotalPages(Math.ceil(totalItems / limit));
      
          const ordersData = response.data.data.map((entry: any) => ({
            // id: index + 1 + (page - 1) * limit,
            id: entry.createdAt,
            date: new Date(entry.createdAt).toLocaleDateString('ru-RU'),
            totalAmount: entry.product.price * entry.quantity,
            items: [
              {
                id: entry.product.id,
                title: entry.product.title,
                quantity: entry.quantity,
                price: entry.product.price,
              }
            ]
          }));
      
          setOrders(ordersData);
          setError(null); // Очистим ошибку
        } catch (err) {
          setError('Ошибка загрузки заказов!!!');
        } finally {
          setLoading(false);
        }
      };

    fetchOrders();
  }, [page]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={s.ordersPage}>
      <h1>Ваши заказы</h1>
      <div className={s.orderList}>
        {orders.map((order) => (
          <OrderCard key={order.id} {...order} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}