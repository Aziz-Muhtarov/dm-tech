// components/UI/BackButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import s from './styles.module.scss';

const BackButton = () => {
  const router = useRouter();
  const previousPage = sessionStorage.getItem('previousPage') || '/';
  console.log('Previous page:', previousPage); // Для дебага

  return (
    <div className={s.backButtonWrapper} onClick={() => router.push(previousPage)}>
      <Image src="/arrowLeft.svg" alt="reversArrow" width={16} height={14}/>
      <button className={s.backButton}>Назад</button>
    </div>
  );
};

export default BackButton;