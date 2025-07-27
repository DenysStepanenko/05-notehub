import { useState } from 'react';
import type { ChangeEvent } from 'react';
import css from './SearchBox.module.css';

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox = ({ onSearch }: SearchBoxProps) => {
  const [value, setValue] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    onSearch(newValue);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={css.searchBox}>
      <div className={css.inputWrapper}>
        <span className={css.searchIcon}>🔍</span>
        <input
          className={css.input}
          type="text"
          placeholder="Search notes by title or content..."
          value={value}
          onChange={handleChange}
          aria-label="Search notes"
        />
        {value && (
          <button
            className={css.clearButton}
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBox