// Reusable Pagination Component
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  buildUrl: (pageNum: number) => string;
  onPageChange: (pageNum: number) => void;
  maxVisiblePages?: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  buildUrl,
  onPageChange,
  maxVisiblePages = 5,
  className = '',
}: PaginationProps) {
  const router = useRouter();
  
  if (totalPages <= 1) {
    return null;
  }

  const handleClick = (e: React.MouseEvent, pageNum: number) => {
    e.preventDefault();
    onPageChange(pageNum);
    router.push(buildUrl(pageNum), { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate page range to display
  const getPageRange = () => {
    const pages: number[] = [];
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageRange = getPageRange();
  const showFirstPage = pageRange[0] > 1;
  const showLastPage = pageRange[pageRange.length - 1] < totalPages;

  return (
    <div className={`col-12 mt-4 ${className}`}>
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center flex-wrap">
          {/* Previous Button */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            {currentPage === 1 ? (
              <span className="page-link">Previous</span>
            ) : (
              <Link
                href={buildUrl(currentPage - 1)}
                className="page-link"
                onClick={(e) => handleClick(e, currentPage - 1)}
              >
                Previous
              </Link>
            )}
          </li>

          {/* First Page + Ellipsis */}
          {showFirstPage && (
            <>
              <li className="page-item">
                <Link
                  href={buildUrl(1)}
                  className="page-link"
                  onClick={(e) => handleClick(e, 1)}
                >
                  1
                </Link>
              </li>
              {pageRange[0] > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}

          {/* Page Numbers */}
          {pageRange.map((pageNum) => (
            <li
              key={pageNum}
              className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
            >
              {currentPage === pageNum ? (
                <span className="page-link">
                  {pageNum}
                  <span className="visually-hidden">(current)</span>
                </span>
              ) : (
                <Link
                  href={buildUrl(pageNum)}
                  className="page-link"
                  onClick={(e) => handleClick(e, pageNum)}
                >
                  {pageNum}
                </Link>
              )}
            </li>
          ))}

          {/* Ellipsis + Last Page */}
          {showLastPage && (
            <>
              {pageRange[pageRange.length - 1] < totalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className="page-item">
                <Link
                  href={buildUrl(totalPages)}
                  className="page-link"
                  onClick={(e) => handleClick(e, totalPages)}
                >
                  {totalPages}
                </Link>
              </li>
            </>
          )}

          {/* Next Button */}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            {currentPage === totalPages ? (
              <span className="page-link">Next</span>
            ) : (
              <Link
                href={buildUrl(currentPage + 1)}
                className="page-link"
                onClick={(e) => handleClick(e, currentPage + 1)}
              >
                Next
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}

