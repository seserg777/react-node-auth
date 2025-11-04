// Product Sort Component
'use client';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

interface ProductSortProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  className?: string;
}

export default function ProductSort({ sortBy, onSortChange, className = '' }: ProductSortProps) {
  return (
    <div className={`d-flex flex-column align-items-md-end ${className}`}>
      <div className="d-flex align-items-center">
        <label htmlFor="sortSelect" className="me-2 text-nowrap">
          <i className="bi bi-sort-down me-1"></i>
          Sort by:
        </label>
        <select
          id="sortSelect"
          className={`form-select form-select-sm ${sortBy !== 'default' ? 'border-primary' : ''}`}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          style={{ width: 'auto', minWidth: '180px' }}
        >
          <option value="default">Default</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>
      {sortBy !== 'default' && (
        <small className="text-muted mt-1">
          <i className="bi bi-check-circle-fill text-success me-1"></i>
          Sorting active (resets when page reloads)
        </small>
      )}
    </div>
  );
}

