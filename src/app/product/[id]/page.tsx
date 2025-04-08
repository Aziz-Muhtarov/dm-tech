import { notFound } from "next/navigation";
import s from "./styles.module.scss";
import Image from 'next/image'
import BackButton from "@/components/UI/BackButton/BackButton";
import CartControls from "@/components/UI/CartControls/CartControls";

interface ProductPageProps {
    params: {id: string};
}

export default async function ProductPage({params} : ProductPageProps) {
    const {id} = params;


    const res = await fetch(`https://skillfactory-task.detmir.team/products/${id}`);
    if (!res.ok) return notFound();

    const product = await res.json();

    return (
      <div className={s.productPage}>
        <div className={s.backButtonWrapper}>
            <BackButton />
        </div>
        <div className={s.productCard}>
          <div className={s.firstSection}>
            <img
              src={product.picture || "/placeholder.png"}
              alt={product.title}
              className={s.image}
            />
            <div className={s.content}>
              <h1 className={s.title}>{product.title}</h1>
              <span className={s.rating}>⭐⭐⭐⭐⭐ {product.rating}</span>
              <span className={s.price}>{product.price} ₽</span>
              <CartControls 
                productId={product.id} 
                price={product.price} 
                title={product.title} 
                picture={product.picture} 
                hideAddButton={false}
                showCheckoutButton={true}
                allowRemove={false}
                mode="inline"
              />
              <div className={s.titleWrapper}>
                <Image src="/reversArrow.svg" alt="reversArrow" width={20} height={20}/>
                <h2 className={s.title}>Условия возврата</h2>
              </div>
              <p className={s.text}>Обменять или вернуть товар надлежащего качества можно в течение 14 дней с момента покупки.</p>
              <p className={s.subText}>Цены в интернет-магазине могут отличаться от розничных магазинов.</p>
            </div>
          </div>

          <div className={s.secondSection}>
            <h1 className={s.title}>Описание</h1>
            <div className={s.description} dangerouslySetInnerHTML={{ __html: product.description }}></div>
          </div>
        </div>
      </div>
    );
}