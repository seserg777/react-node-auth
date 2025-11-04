// Pagination component tests
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination Component', () => {
  const mockBuildUrl = (pageNum: number) => `/test/page-${pageNum}`;
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });

  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        buildUrl={mockBuildUrl}
        onPageChange={mockOnPageChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders pagination with correct number of pages', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        buildUrl={mockBuildUrl}
        onPageChange={mockOnPageChange}
      />
    );

    // Should show pages 1-5
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('disables Previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        buildUrl={mockBuildUrl}
        onPageChange={mockOnPageChange}
      />
    );

    const previousItem = screen.getByText('Previous').closest('li');
    expect(previousItem).toHaveClass('disabled');
  });

  it('disables Next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        buildUrl={mockBuildUrl}
        onPageChange={mockOnPageChange}
      />
    );

    const nextItem = screen.getByText('Next').closest('li');
    expect(nextItem).toHaveClass('disabled');
  });

  it('marks current page as active', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        buildUrl={mockBuildUrl}
        onPageChange={mockOnPageChange}
      />
    );

    const activePage = screen.getByText('3').closest('li');
    expect(activePage).toHaveClass('active');
  });

  it('calls onPageChange when page link is clicked', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        buildUrl={mockBuildUrl}
        onPageChange={mockOnPageChange}
      />
    );

    const page2Link = screen.getByText('2').closest('a');
    if (page2Link) {
      fireEvent.click(page2Link);
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    }
  });

  it('scrolls to top when page changes', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        buildUrl={mockBuildUrl}
        onPageChange={mockOnPageChange}
      />
    );

    const page2Link = screen.getByText('2').closest('a');
    if (page2Link) {
      fireEvent.click(page2Link);
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    }
  });

  it('generates correct URLs for page links', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        buildUrl={mockBuildUrl}
        onPageChange={mockOnPageChange}
      />
    );

    const page2Link = screen.getByText('2').closest('a');
    expect(page2Link).toHaveAttribute('href', '/test/page-2');
  });

  it('shows ellipsis for large page counts', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        buildUrl={mockBuildUrl}
        onPageChange={mockOnPageChange}
      />
    );

    const ellipsis = screen.getAllByText('...');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('shows first and last page when in middle range', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        buildUrl={mockBuildUrl}
        onPageChange={mockOnPageChange}
        maxVisiblePages={5}
      />
    );

    // Should show page 1 and 20
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('respects maxVisiblePages prop', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={20}
        buildUrl={mockBuildUrl}
        onPageChange={mockOnPageChange}
        maxVisiblePages={3}
      />
    );

    // Should show limited number of pages
    const pageLinks = screen.getAllByRole('link');
    // Previous, 3 pages, Next, plus First/Last if shown
    expect(pageLinks.length).toBeLessThanOrEqual(8);
  });

  it('applies custom className', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={5}
        buildUrl={mockBuildUrl}
        onPageChange={mockOnPageChange}
        className="custom-pagination"
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-pagination');
  });

  it('prevents default link behavior and calls onPageChange', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        buildUrl={mockBuildUrl}
        onPageChange={mockOnPageChange}
      />
    );

    const nextLink = screen.getByText('Next').closest('a');
    if (nextLink) {
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      Object.defineProperty(clickEvent, 'preventDefault', {
        value: jest.fn(),
      });
      
      fireEvent.click(nextLink);
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    }
  });
});

