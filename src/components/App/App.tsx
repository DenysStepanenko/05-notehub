import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Використовуємо debounce для пошуку
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Скидаємо на першу сторінку при пошуку
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={searchTerm} onChange={handleSearchChange} />
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>
        
        <main>
          <NoteList
            currentPage={currentPage}
            searchTerm={debouncedSearchTerm}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default App;

