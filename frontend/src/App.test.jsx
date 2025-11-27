import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock all the page components to simplify testing
vi.mock('./views/LandingPage', () => ({
  default: () => <div data-testid="landing-page">Landing Page</div>
}));

vi.mock('./views/SignInPage', () => ({
  default: () => <div data-testid="signin-page">Sign In Page</div>
}));

vi.mock('./views/SignUpPage', () => ({
  default: () => <div data-testid="signup-page">Sign Up Page</div>
}));

vi.mock('./views/ContactPage', () => ({
  default: () => <div data-testid="contact-page">Contact Page</div>
}));

vi.mock('./views/TermsPage', () => ({
  default: () => <div data-testid="terms-page">Terms Page</div>
}));

vi.mock('./components/common/ProtectedRoute', () => ({
  default: ({ children }) => <div data-testid="protected-route">{children}</div>
}));

vi.mock('./components/common/ScrollToTopOnRouteChange', () => ({
  default: () => null
}));

describe('App Routing', () => {
  it('renders landing page at root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });

  it('renders sign in page at /signin', () => {
    render(
      <MemoryRouter initialEntries={['/signin']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('signin-page')).toBeInTheDocument();
  });

  it('renders sign up page at /signup', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('signup-page')).toBeInTheDocument();
  });

  it('renders contact page at /contact', () => {
    render(
      <MemoryRouter initialEntries={['/contact']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('contact-page')).toBeInTheDocument();
  });

  it('renders terms page at /terms', () => {
    render(
      <MemoryRouter initialEntries={['/terms']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('terms-page')).toBeInTheDocument();
  });
});
