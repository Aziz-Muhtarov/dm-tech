'use client';
import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('https://skillfactory-task.detmir.team/categories')
      .then(response => setData(response.data))
      .catch(error => console.error('Ошибка', error));
  }, []);

  if (!data) return <p>Загрузка...</p>;

  return (
    <>
      <h1>{data}</h1>
      <Button variant="contained" color="primary">
        Я стилизованная кнопка
      </Button>
    </>
  );
}