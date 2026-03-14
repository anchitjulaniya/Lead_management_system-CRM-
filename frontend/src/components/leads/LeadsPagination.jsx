export default function LeadsPagination({ page, totalPages, setPage }) {

  return (

    <div className="flex justify-center mt-6 gap-4">

      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Prev
      </button>

      <span className="flex items-center font-medium">
        Page {page} / {totalPages}
      </span>

      <button
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>

    </div>

  );
}