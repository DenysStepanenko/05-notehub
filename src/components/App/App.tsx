import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes, createNote, deleteNote } from '../../services/noteService';
import type { CreateNoteData } from '../../types/note';

// Импорты компонентов
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';

// Импорт стилей
import css from './App.module.css';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const queryClient = useQueryClient();

  const {
    data: notesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notes', currentPage, debouncedSearchQuery],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 6,
        search: debouncedSearchQuery || undefined,
      }),
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
      setCurrentPage(1);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleCreateNote = (noteData: CreateNoteData) => {
    createNoteMutation.mutate(noteData);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNoteMutation.mutate(noteId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.header}>
        <div className={css.container}>
          <h1 className={css.title}>📝 NoteHub</h1>
          <p className={css.subtitle}>Organize your thoughts and ideas</p>
          
          <div className={css.toolbar}>
            <SearchBox onSearch={handleSearch} />
            <button 
              className={css.createButton} 
              onClick={openModal}
              type="button"
            >
              ➕ Create Note
            </button>
          </div>
        </div>
      </header>

      <main className={css.main}>
        <div className={css.container}>
          {isLoading && (
            <div className={css.loading}>
              <div className={css.spinner}></div>
              <p>Loading notes...</p>
            </div>
          )}

          {error && (
            <div className={css.error}>
              <p>❌ Failed to load notes. Please try again.</p>
            </div>
          )}

          {notesData && (
            <>
              {notesData.data && notesData.data.length === 0 ? (
                <div className={css.emptyState}>
                  <h2>No notes found</h2>
                  <p>
                    {searchQuery 
                      ? `No notes match "${searchQuery}". Try a different search term.`
                      : 'Start by creating your first note!'
                    }
                  </p>
                </div>
              ) : (
                <>
                  {notesData.data && (
                    <NoteList
                      notes={notesData.data}
                      onDeleteNote={handleDeleteNote}
                      isDeleting={deleteNoteMutation.isPending}
                    />
                  )}
                  
                  {notesData.totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={notesData.totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal с обязательными пропсами */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm 
            onSubmit={handleCreateNote}
            onCancel={closeModal}
            isSubmitting={createNoteMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;