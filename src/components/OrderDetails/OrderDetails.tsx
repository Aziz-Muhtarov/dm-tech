'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import s from './styles.module.scss';
import CartControls from "@/components/UI/CartControls/CartControls";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice"; // Для добавления товаров в корзину

interface OrderDetailsProps {
  params: { id: string };
}

export default function OrderDetails({ params }: OrderDetailsProps) {
    const orderIndex = parseInt(params.id, 10) - 1; // Преобразуем строку в индекс (0-based)
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [orderDate, setOrderDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
  
    // useEffect(() => {
    //   const fetchOrders = async () => {
    //     try {
    //       const response = await axios.get('https://skillfactory-task.detmir.team/orders');
    //       const allItems = response.data.data;
  
    //       // Группируем заказы по дате (createdAt)
    //       const groupedByDate: { [key: string]: any[] } = {};
    //       allItems.forEach((item: any) => {
    //         const date = new Date(item.createdAt).toLocaleDateString('ru-RU');
    //         if (!groupedByDate[date]) groupedByDate[date] = [];
    //         groupedByDate[date].push(item);
    //       });
  
    //       const groupedOrders = Object.entries(groupedByDate);
  
    //       // Получаем "виртуальный заказ" по индексу
    //       if (groupedOrders[orderIndex]) {
    //         const [date, items] = groupedOrders[orderIndex];
    //         setOrderDate(date);
    //         setOrderItems(items);
    //       } else {
    //         setError('Заказ не найден');
    //       }
    //     } catch (err) {
    //       setError('Ошибка загрузки заказа');
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
  
    //   fetchOrders();
    // }, [orderIndex]);

    const orderDateKey = decodeURIComponent(params.id); // Добавил ласт апдейте

    useEffect(() => {
        const fetchOrders = async () => {
          try {
            const response = await axios.get('https://skillfactory-task.detmir.team/orders');
            const allItems = response.data.data;
      
            const formattedItems = allItems.filter((item: any) => {
              const date = new Date(item.createdAt).toLocaleDateString('ru-RU');
              return date === orderDateKey;
            });
      
            if (formattedItems.length > 0) {
              setOrderItems(formattedItems);
              setOrderDate(orderDateKey);
            } else {
              setError('Заказ не найден');
            }
          } catch (err) {
            setError('Ошибка загрузки заказа');
          } finally {
            setLoading(false);
          }
        };
      
        fetchOrders();
      }, [orderDateKey]);
  
    const handleRepeatOrder = () => {
        orderItems.forEach((item: any) => {
            const { product, quantity } = item;
            dispatch(addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                picture: product.picture,
                quantity: quantity || 1, // Если quantity нет, ставим 1 по умолчанию
            }));
        });
    };
  
    const totalAmount = orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;
  
    return (
      <div className={s.orderDetails}>
        <h1>Заказ #{params.id}</h1>
        <p>Дата: {orderDate}</p>
        <p>Итого: {totalAmount.toLocaleString('ru-RU')} ₽</p>
        <div className={s.items}>
          {orderItems.map((item: any, index) => (
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