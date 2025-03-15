'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Header from '@/components/header/header'
import ProductCard from "@/components/ProductCard/productCard";
import s from './styles.module.scss';

interface Product {
  id: number;
  category: string;
  title: string;
  description: string;
  price: number;
  picture: string;
  rating: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://skillfactory-task.detmir.team/products?page=1&limit=15&sort=title%3Aasc");
        
        console.log("Данные от API:", response.data); // Проверяем всю структуру ответа
        console.log("Массив товаров:", response.data.data); // Проверяем, что массив товаров доступен
  
        const formattedData = response.data.data.map((data: any) => ({
          id: data.id,
          category: data.category || "Не указано",
          title: data.title || "Без названия",
          description: data.description || "Нет описания",
          price: data.price || 0,
          picture: data.image || "/placeholder.png",
          rating: typeof data.rating === "number" ? data.rating : (data.rating?.rate || 0),
        }));
  
        console.log("Отформатированные данные:", formattedData); // Проверяем, что форматированные данные корректные
        setProducts(formattedData);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Ошибка загрузки товаров");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Header />
      
      <div className={s.productCardContainer}>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
      ))}
      </div>
    </>
  );
}