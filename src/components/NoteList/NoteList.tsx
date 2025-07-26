import css from "./NoteList.module.css";

interface NoteListProps {
  currentPage: number;
  searchTerm: string;
  onPageChange: (page: number) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  currentPage,
  searchTerm,
  onPageChange,
}) => {
  return (
    <div className={css.loading}>
      Loading notes... (API token needed)
      <br />
      Current page: {currentPage}
      <br />
      Search term: {searchTerm}
    </div>
  );
};

export default NoteList;

