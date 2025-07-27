import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDebounce } from "../../hooks/useDebounce";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
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
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage + 1);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={searchTerm} onChange={handleSearchChange} />
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            searchTerm={debouncedSearchTerm}
          />
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>
        
        <main>
          <NoteList
            currentPage={currentPage}
            searchTerm={debouncedSearchTerm}
          />
        </main>

        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onClose={closeModal} />
          </Modal>
        )}
      </div>
    </QueryClientProvider>
  );
};

export default App;

