'use client';

import React from 'react';
import s from './styles.module.scss'
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartWidget from "@/components/Cart/CartWidget";
import Image from 'next/image'

interface Props {}

const header : React.FC<Props> = () => {
    const pathname = usePathname();

  return (
    <div className={s.headerWrapper}>
        <Image src="/logo.png" alt="Логотип" width={150} height={50}/>
        <nav>
            <Link href="/" className={pathname === "/" ? s.active : ""}>Товары</Link>
            <Link href="/orders" className={pathname === "/orders" ? s.active : ""}>Заказы</Link>
        </nav>
        <div>
          <CartWidget />
        </div>
    </div>
  );
};

export default header;