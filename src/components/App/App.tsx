import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { fetchNotes } from '../../services/noteService.ts';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import Loader from '../Loader/Loader.tsx';
import Modal from '../Modal/Modal.tsx'; // ❌ Было: Modal.module.tsx
import NoteList from '../NoteList/NoteList.tsx';
import NoteForm from '../NoteForm/NoteForm.tsx';
import Pagination from '../Pagination/Pagination.tsx';
import SearchBox from '../SearchBox/SearchBox.tsx';

import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalNote, setIsModalNote] = useState(false);
  const perPage = 12;

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', query, page],
    queryFn: () => fetchNotes(query, page, perPage),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;
  
  const updateQuery = useDebouncedCallback((newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  }, 1000);

  const openModal = () => setIsModalNote(true);
  const closeModal = () => setIsModalNote(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onSearch={updateQuery} />
        {isSuccess && totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} changePage={setPage} />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isModalNote && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
