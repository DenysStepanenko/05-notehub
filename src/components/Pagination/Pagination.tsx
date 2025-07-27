import css from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getVisiblePages = () => {
    const delta = 2; // Количество страниц слева и справа от текущей
    const range = [];
    const rangeWithDots = [];

    // Всегда показываем первую страницу
    range.push(1);

    // Добавляем страницы вокруг текущей
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Всегда показываем последнюю страницу (если она не первая)
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Убираем дубликаты и сортируем
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // Добавляем многоточия где нужно
    for (let i = 0; i < uniqueRange.length; i++) {
      if (i === 0) {
        rangeWithDots.push(uniqueRange[i]);
      } else if (uniqueRange[i] - uniqueRange[i - 1] === 2) {
        rangeWithDots.push(uniqueRange[i - 1] + 1);
        rangeWithDots.push(uniqueRange[i]);
      } else if (uniqueRange[i] - uniqueRange[i - 1] !== 1) {
        rangeWithDots.push('...');
        rangeWithDots.push(uniqueRange[i]);
      } else {
        rangeWithDots.push(uniqueRange[i]);
      }
    }

    return rangeWithDots;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages();

  return (
    <nav className={css.pagination} aria-label="Pagination navigation">
      <button
        className={`${css.button} ${css.navButton}`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        type="button"
      >
        ← Previous
      </button>

      <div className={css.pages}>
        {visiblePages.map((page, index) => (
          <button
            key={index}
            className={`${css.button} ${css.pageButton} ${
              page === currentPage ? css.active : ''
            } ${page === '...' ? css.dots : ''}`}
            onClick={() => handlePageClick(page)}
            disabled={page === '...' || page === currentPage}
            aria-label={page === '...' ? 'More pages' : `Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            type="button"
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className={`${css.button} ${css.navButton}`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        type="button"
      >
        Next →
      </button>
    </nav>
  );
};

export default Pagination;