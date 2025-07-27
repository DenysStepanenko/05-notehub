import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "../../services/noteService";
import css from "./NoteList.module.css";

interface NoteListProps {
  currentPage: number;
  searchTerm: string;
}

const NoteList: React.FC<NoteListProps> = ({
  currentPage,
  searchTerm,
}) => {
  const queryClient = useQueryClient();

  const {
    data: notesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes", currentPage, searchTerm],
    queryFn: () => fetchNotes({ page: currentPage, search: searchTerm }),
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (noteId: string) => {
    deleteNoteMutation.mutate(noteId);
  };

  if (isLoading) {
    return <div className={css.loading}>Loading notes...</div>;
  }

  if (error) {
    return (
      <div className={css.error}>
        Error loading notes. Please check your API token.
        <br />
        Error: {error instanceof Error ? error.message : 'Unknown error'}
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
              onClick={() => handleDelete(note.id)}
              disabled={deleteNoteMutation.isPending}
            >
              {deleteNoteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;

