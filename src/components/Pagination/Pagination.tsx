import React from "react";
import s from "./styles.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = [];
  const range = 2; // Количество страниц по бокам от текущей страницы
  let start = Math.max(currentPage - range, 1);
  let end = Math.min(currentPage + range, totalPages);

  // Добавляем первую страницу, если она не в пределах видимого диапазона
  if (start > 1) pages.push(1);

  // Добавляем страницы между start и end
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Добавляем последнюю страницу, если она не в пределах видимого диапазона
  if (end < totalPages) pages.push(totalPages);

  return (
    <div className={s.pagination}>
      {/* Стрелка влево */}
      <button
        className={s.arrowButton}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img src="/arrowLeft.svg" alt="arrow" />
      </button>

      {/* Кнопки с номерами страниц */}
      {pages.map((page) => (
        <button
          key={page}
          className={`${s.pageButton} ${currentPage === page ? s.active : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Стрелка вправо */}
      <button
        className={s.arrowButton}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img src="/arrowRight.svg" alt="arrow" />
      </button>
    </div>
  );
};

export default Pagination;