import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';

describe('Footer', () => {
  it('renders copyright text with current year', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`, 'i'))).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    expect(screen.getByText('Regulamin')).toBeInTheDocument();
    expect(screen.getByText('Polityka Prywatności')).toBeInTheDocument();
    expect(screen.getByText('Warunki Usługi')).toBeInTheDocument();
    expect(screen.getByText('Kontakt')).toBeInTheDocument();
  });

  it('links have correct href attributes', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const termsLink = screen.getByText('Regulamin').closest('a');
    const privacyLink = screen.getByText('Polityka Prywatności').closest('a');
    const tosLink = screen.getByText('Warunki Usługi').closest('a');
    const contactLink = screen.getByText('Kontakt').closest('a');

    expect(termsLink).toHaveAttribute('href', '/terms');
    expect(privacyLink).toHaveAttribute('href', '/privacy-policy');
    expect(tosLink).toHaveAttribute('href', '/terms-of-service');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('renders SmartSaver branding', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    expect(screen.getByText('Smart', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('aver', { exact: false })).toBeInTheDocument();
  });
});
