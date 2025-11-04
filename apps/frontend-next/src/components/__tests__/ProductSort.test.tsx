// ProductSort component tests
import { render, screen, fireEvent } from '@testing-library/react';
import ProductSort, { type SortOption } from '../ProductSort';

describe('ProductSort Component', () => {
  const mockOnSortChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sort dropdown with all options', () => {
    render(<ProductSort sortBy="default" onSortChange={mockOnSortChange} />);

    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.options).toHaveLength(5);
    expect(select.options[0].value).toBe('default');
    expect(select.options[1].value).toBe('name-asc');
    expect(select.options[2].value).toBe('name-desc');
    expect(select.options[3].value).toBe('price-asc');
    expect(select.options[4].value).toBe('price-desc');
  });

  it('displays default value correctly', () => {
    render(<ProductSort sortBy="default" onSortChange={mockOnSortChange} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('default');
  });

  it('displays selected sort option correctly', () => {
    render(<ProductSort sortBy="price-asc" onSortChange={mockOnSortChange} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('price-asc');
  });

  it('calls onSortChange when selection changes', () => {
    render(<ProductSort sortBy="default" onSortChange={mockOnSortChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'price-asc' } });

    expect(mockOnSortChange).toHaveBeenCalledWith('price-asc');
    expect(mockOnSortChange).toHaveBeenCalledTimes(1);
  });

  it('does not show success message when sort is default', () => {
    render(<ProductSort sortBy="default" onSortChange={mockOnSortChange} />);

    expect(screen.queryByText(/sorting active/i)).not.toBeInTheDocument();
  });

  it('shows success message when sort is active', () => {
    render(<ProductSort sortBy="price-asc" onSortChange={mockOnSortChange} />);

    expect(screen.getByText(/sorting active/i)).toBeInTheDocument();
  });

  it('applies border-primary class when sort is active', () => {
    render(<ProductSort sortBy="name-asc" onSortChange={mockOnSortChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-primary');
  });

  it('does not apply border-primary class when sort is default', () => {
    render(<ProductSort sortBy="default" onSortChange={mockOnSortChange} />);

    const select = screen.getByRole('combobox');
    expect(select).not.toHaveClass('border-primary');
  });

  it('applies custom className prop', () => {
    const { container } = render(
      <ProductSort sortBy="default" onSortChange={mockOnSortChange} className="custom-class" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('renders sort icon', () => {
    render(<ProductSort sortBy="default" onSortChange={mockOnSortChange} />);

    const icon = document.querySelector('.bi-sort-down');
    expect(icon).toBeInTheDocument();
  });

  it('renders success icon when sorting is applied', () => {
    render(<ProductSort sortBy="price-desc" onSortChange={mockOnSortChange} />);

    const successIcon = document.querySelector('.bi-check-circle-fill');
    expect(successIcon).toBeInTheDocument();
  });

  it('handles all sort option changes correctly', () => {
    const { rerender } = render(<ProductSort sortBy="default" onSortChange={mockOnSortChange} />);

    const select = screen.getByRole('combobox');
    const sortOptions: SortOption[] = ['name-asc', 'name-desc', 'price-asc', 'price-desc'];

    sortOptions.forEach((option) => {
      fireEvent.change(select, { target: { value: option } });
      expect(mockOnSortChange).toHaveBeenCalledWith(option);
    });

    expect(mockOnSortChange).toHaveBeenCalledTimes(4);
  });
});

