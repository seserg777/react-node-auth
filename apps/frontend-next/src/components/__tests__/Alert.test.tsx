// Alert component tests
import { render, screen, fireEvent } from '@testing-library/react';
import Alert, { ErrorAlert, SuccessAlert, WarningAlert, InfoAlert } from '../Alert';

describe('Alert Component', () => {
  it('renders basic alert with message', () => {
    render(<Alert type="info" message="Test message" />);
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('alert-info');
  });

  it('renders alert with title and message', () => {
    render(<Alert type="warning" title="Warning" message="Be careful" />);
    
    expect(screen.getByText(/Warning:/)).toBeInTheDocument();
    expect(screen.getByText('Be careful')).toBeInTheDocument();
  });

  it('renders dismissible alert with close button', () => {
    const mockOnDismiss = jest.fn();
    render(<Alert type="danger" message="Error occurred" dismissible onDismiss={mockOnDismiss} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
    
    fireEvent.click(closeButton);
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render close button when not dismissible', () => {
    render(<Alert type="info" message="Information" />);
    
    const closeButton = screen.queryByRole('button', { name: /close/i });
    expect(closeButton).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Alert type="success" message="Success" className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with custom icon', () => {
    const customIcon = <span data-testid="custom-icon">★</span>;
    render(<Alert type="primary" message="Message" icon={customIcon} />);
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies correct Bootstrap alert class based on type', () => {
    const types: Array<{ type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' }> = [
      { type: 'primary' },
      { type: 'secondary' },
      { type: 'success' },
      { type: 'danger' },
      { type: 'warning' },
      { type: 'info' },
    ];

    types.forEach(({ type }) => {
      const { container } = render(<Alert type={type} message="Test" />);
      expect(container.firstChild).toHaveClass(`alert-${type}`);
    });
  });
});

describe('ErrorAlert Component', () => {
  it('renders error alert with danger styling', () => {
    render(<ErrorAlert message="Something went wrong" />);
    
    expect(screen.getByRole('alert')).toHaveClass('alert-danger');
    expect(screen.getByText(/Error:/)).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<ErrorAlert message="Failed" title="Custom Error" />);
    
    expect(screen.getByText(/Custom Error:/)).toBeInTheDocument();
  });

  it('displays error icon', () => {
    const { container } = render(<ErrorAlert message="Error" />);
    
    const icon = container.querySelector('.bi-exclamation-triangle-fill');
    expect(icon).toBeInTheDocument();
  });

  it('can be dismissible', () => {
    const mockOnDismiss = jest.fn();
    render(<ErrorAlert message="Dismissible error" dismissible onDismiss={mockOnDismiss} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockOnDismiss).toHaveBeenCalled();
  });
});

describe('SuccessAlert Component', () => {
  it('renders success alert with success styling', () => {
    render(<SuccessAlert message="Operation completed" />);
    
    expect(screen.getByRole('alert')).toHaveClass('alert-success');
    expect(screen.getByText(/Success:/)).toBeInTheDocument();
  });

  it('displays success icon', () => {
    const { container } = render(<SuccessAlert message="Done" />);
    
    const icon = container.querySelector('.bi-check-circle-fill');
    expect(icon).toBeInTheDocument();
  });
});

describe('WarningAlert Component', () => {
  it('renders warning alert with warning styling', () => {
    render(<WarningAlert message="Please be cautious" />);
    
    expect(screen.getByRole('alert')).toHaveClass('alert-warning');
    expect(screen.getByText(/Warning:/)).toBeInTheDocument();
  });

  it('displays warning icon', () => {
    const { container } = render(<WarningAlert message="Caution" />);
    
    const icon = container.querySelector('.bi-exclamation-circle-fill');
    expect(icon).toBeInTheDocument();
  });
});

describe('InfoAlert Component', () => {
  it('renders info alert with info styling', () => {
    render(<InfoAlert message="For your information" />);
    
    expect(screen.getByRole('alert')).toHaveClass('alert-info');
    expect(screen.getByText(/Info:/)).toBeInTheDocument();
  });

  it('displays info icon', () => {
    const { container } = render(<InfoAlert message="FYI" />);
    
    const icon = container.querySelector('.bi-info-circle-fill');
    expect(icon).toBeInTheDocument();
  });
});

