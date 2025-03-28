'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ProductCard from "@/components/ProductCard/productCard";
import Pagination from '@/components/Pagination/Pagination';
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
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const limit = 15;


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`https://skillfactory-task.detmir.team/products?page=${page}&limit=${limit}&sort=title%3Aasc`);
      
        console.log("Данные от API:", response.data); // Проверяем всю структуру ответа
        console.log("Массив товаров:", response.data.data); // Проверяем, что массив товаров доступен
        setTotalPages(Math.ceil(response.data.total / limit));

        console.log("totalPages:", Math.ceil(response.data.total / limit));

        // Доступ к total внутри meta
      const totalItems = response.data.meta.total;
      if (typeof totalItems === "number") {
        setTotalPages(Math.ceil(totalItems / limit));
      } else {
        console.error("totalItems не является числом");
      }
  
        const formattedData = response.data.data.map((data: any) => ({
          id: data.id,
          category: data.category || "Не указано",
          title: data.title || "Без названия",
          description: data.description || "Нет описания",
          price: data.price || 0,
          picture: data.picture || "/placeholder.png",
          rating: typeof data.rating === "number" ? data.rating : (data.rating?.rate || 0),
        }));
  
        setProducts(formattedData);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Ошибка загрузки товаров");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [page]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      
      <div className={s.productCardContainer}>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
      ))}
      </div>

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />
    </>
  );
}