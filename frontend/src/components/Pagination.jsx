function Pagination({ pagination, onPageChange, loading = false, showInfo = true }) {
  if (!pagination || pagination.total_pages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages && !loading) {
      onPageChange(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const { total_pages, page } = pagination;

    if (total_pages <= 7) {
      
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      
      if (page <= 4) {
       
        pages.push(1, 2, 3, 4, 5, '...', total_pages);
      } else if (page >= total_pages - 3) {
     
        pages.push(1, '...', total_pages - 4, total_pages - 3, total_pages - 2, total_pages - 1, total_pages);
      } else {
        
        pages.push(1, '...', page - 1, page, page + 1, '...', total_pages);
      }
    }

    return pages.map((pageNum, index) => {
      if (pageNum === '...') {
        return (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }

      return (
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}
          disabled={loading}
          className={`px-3 py-2 border rounded-lg transition-colors ${
            page === pageNum
              ? 'bg-black text-white border-black'
              : 'hover:bg-gray-100 border-gray-300'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {pageNum}
        </button>
      );
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page <= 1 || loading}
          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
        >
          Previous
        </button>

        <div className="flex gap-1">
          {renderPageNumbers()}
        </div>

        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.total_pages || loading}
          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
        >
          Next
        </button>
      </div>

      {showInfo && (
        <div className="text-sm text-gray-600">
          Page {pagination.page} of {pagination.total_pages} ({pagination.total} total items)
        </div>
      )}
    </div>
  );
}

export default Pagination;
