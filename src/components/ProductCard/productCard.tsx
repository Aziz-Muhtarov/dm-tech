"use client";

import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import s from "./styles.module.scss";

interface ProductCardProps {
  id: number;
  category: string;
  title: string;
  description: string;
  price: number;
  picture: string;
  rating: number;
}

const ProductCard: React.FC<ProductCardProps> = ({id, title, price, picture, rating}) => {
  const formatPrice = (price: number) => price.toLocaleString("ru-RU");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Сохраняем текущий путь в sessionStorage
      const currentPath = window.location.pathname;
      sessionStorage.setItem('previousPage', currentPath);
    }
  }, []);

  const handleClick = () => {
    router.push(`/product/${id}`);
  };

  return (
    <div className={s.card} onClick={handleClick}>
      {/* Изображение товара */}
      <div className={s.imageWrapper}>
        <img src={picture} alt={title} className={s.image} />
      </div>

      {/* Информация о товаре */}
      <div className={s.content}>
        <h3 className={s.title}>{title}</h3>
        <span className={s.rating}>⭐⭐⭐⭐⭐ {rating.toFixed(1)}</span>
        <span className={s.price}>{formatPrice(price)} ₽</span>
      </div>
    </div>
  );
};

export default ProductCard;
