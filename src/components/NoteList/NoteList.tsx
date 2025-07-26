import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import css from "./NoteList.module.css";

interface NoteListProps {
  currentPage: number;
  searchTerm: string;
}

const NoteList: React.FC<NoteListProps> = ({
  currentPage,
  searchTerm,
}) => {
  const {
    data: notesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes", currentPage, searchTerm],
    queryFn: () => fetchNotes({ page: currentPage, search: searchTerm }),
  });

  if (isLoading) {
    return <div className={css.loading}>Loading notes...</div>;
  }

  if (error) {
    return (
      <div className={css.error}>
        Error loading notes. Please check your API token.
      </div>
    );
  }

  if (!notesData?.data || notesData.data.length === 0) {
    return (
      <div className={css.empty}>
        {searchTerm ? "No notes found for your search." : "No notes yet. Create your first note!"}
      </div>
    );
  }

  return (
    <ul className={css.list}>
      {notesData.data.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button 
              className={css.button}
              onClick={() => {
                // Здесь будет логика удаления
                console.log('Delete note:', note.id);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
