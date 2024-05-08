import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Game from './pages/Game';
import NavBar from './components/NavBar';

describe('Game component', () => {
  it('renders game', () => {
    render(<Game />);
    const element = screen.getByTestId('game-page');
    expect(element).toBeInTheDocument();
  });

  it('renders board', () => {
    render(<Game />);
    const element = screen.getByTestId('board-grid');
    expect(element).toBeInTheDocument();
  });

  it('game connects to socket server', () => {
    render(<Game />);
    const element = screen.getByText('Connected to server');
    expect(element).toBeInTheDocument();
  });

  it('recieves response from server', () => {
    render(<Game />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'A1' } });

    const button = screen.getByText('Send to Socket');
    fireEvent.click(button);

    const response = screen.getByTestId('response')
    waitFor(()=> {
      expect(response).toEqual('Recieved response: A1')
    })
  });

  
  it('returns to home when navbar button is clicked', () => {
    // Render the NavBar component
    render(<NavBar title="Test Title" />);

    // Simulate a click on the navbar button
    const button = screen.getByTestId('navbar-button');
    fireEvent.click(button);

    // Assert that the page has navigated to the home page
    expect(window.location.href).toBe('http://localhost/');
  });

});

