"use client";

import React from "react";
import Image from "next/image";
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

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  category,
  title,
  description,
  price,
  picture,
  rating,
}) => {
  console.log("Изображение:", picture);
  return (
    <div className={s.card}>
      {/* Изображение товара */}
      <div className={s.imageWrapper}>
        <Image src={picture} alt={title} width={250} height={250} />
      </div>

      {/* Информация о товаре */}
      <div className={s.content}>
        <p className={s.category}>{category}</p>
        <h3 className={s.title}>{title}</h3>
        <p className={s.description}>{description}</p>

        <div className={s.footer}>
          <span className={s.price}>{price} ₽</span>
          <span className={s.rating}>⭐ {rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
