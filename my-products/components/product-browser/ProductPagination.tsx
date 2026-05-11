import { LoadState } from "./types";

export function ProductPagination({
  page,
  setPage,
  pages,
  visiblePageCount,
  listState,
}: {
  page: number;
  setPage: (val: number | ((prev: number) => number)) => void;
  pages: number[];
  visiblePageCount: number;
  listState: LoadState;
}) {
  return (
    <nav className="product-pagination" aria-label="Product pages">
      <button
        type="button"
        onClick={() => setPage((currentPage) => currentPage - 1)}
        disabled={page === 1 || listState === "loading"}
      >
        Prev
      </button>
      {pages.map((pageNumber) => (
        <button
          aria-current={pageNumber === page ? "page" : undefined}
          className={pageNumber === page ? "active-page" : ""}
          disabled={listState === "loading"}
          key={pageNumber}
          type="button"
          onClick={() => setPage(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setPage((currentPage) => currentPage + 1)}
        disabled={page === visiblePageCount || listState === "loading"}
      >
        Next
      </button>
    </nav>
  );
}
