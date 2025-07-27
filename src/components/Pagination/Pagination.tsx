import ReactPaginate from "react-paginate";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
  searchTerm: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
  searchTerm,
}) => {
  const { data } = useQuery({
    queryKey: ["notes", currentPage, searchTerm],
    queryFn: () => fetchNotes({ page: currentPage, search: searchTerm }),
  });

  if (!data || data.totalPages <= 1) {
    return null;
  }

  return (
    <ReactPaginate
      pageCount={data.totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={2}
      onPageChange={({ selected }) => onPageChange(selected)}
      forcePage={currentPage - 1} // react-paginate використовує 0-based індекси
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      activeClassName={css.active}
      previousClassName={css.pageItem}
      nextClassName={css.pageItem}
      previousLinkClassName={css.pageLink}
      nextLinkClassName={css.pageLink}
      disabledClassName={css.disabled}
      breakClassName={css.pageItem}
      breakLinkClassName={css.pageLink}
      previousLabel="‹"
      nextLabel="›"
    />
  );
};

export default Pagination;

