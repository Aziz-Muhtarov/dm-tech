'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import OrderCard from "@/components/OrderCard/OrderCard";
import Pagination from '@/components/Pagination/Pagination';
import { useSearchParams, useRouter } from 'next/navigation';
import s from './styles.module.scss';

interface Order {
  id: string;
  date: string;
  totalAmount: number;
  items: {
    id: number;
    title: string;
    quantity: number;
    price: number;
    picture: string;
  }[];
}

export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [totalPages, setTotalPages] = useState(1);
//   const [page, setPage] = useState(1);
//   const limit = 8;
//   const searchParams = useSearchParams();
//   const newOrder = searchParams.get('newOrder');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = searchParams.get('page');
  const newOrder = searchParams.get('newOrder');
  const page = pageParam ? parseInt(pageParam) : 1;


  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://skillfactory-task.detmir.team/orders?limit=${limit}&page=${page}`, {
            withCredentials: true,
        });

        const totalItems = response.data.meta.total;
        setTotalPages(Math.ceil(totalItems / limit));

        const ordersData = response.data.data.map((entry: any) => {
          const items = entry.map((orderItem: any) => {
            return {
              id: orderItem.product.id,
              title: orderItem.product.title,
              quantity: orderItem.quantity,
              price: orderItem.product.price,
              picture: orderItem.product.picture,
            };
          });

          const totalAmount = items.reduce((sum: any, item: any) => sum + item.price * item.quantity, 0);

          return {
            id: entry[0].createdAt,  // Используем уникальный ID (если нужно, можно заменить на другой уникальный)
            date: new Date(entry[0].createdAt).toLocaleDateString('ru-RU'),
            totalAmount,
            items,
          };
        });

        setOrders(ordersData);
        setError(null);
      } catch {
        setError('Ошибка загрузки заказов!');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, newOrder]);

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}`);
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={s.ordersPage}>
      <div className={s.orderList}>
        {orders.length === 0 && <p>Нет заказов для отображения</p>}
        {orders.map((order) => {
          return <OrderCard key={order.id} {...order} />;
        })}
      </div>
       <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}