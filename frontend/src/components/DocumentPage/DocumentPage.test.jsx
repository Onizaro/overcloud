import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentPage from './DocumentPage';

// Mock fetch API
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => 'fake-token'),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.confirm
window.confirm = jest.fn(() => true);

describe('DocumentPage Component', () => {
  beforeEach(() => {
    fetch.mockReset();
    jest.clearAllMocks();
  });

  test('renders DocumentPage correctly', () => {
    // Mock successful response for the initial fetch
    fetch.mockResolvedValueOnce({
      json: async () => []
    });

    render(<DocumentPage />);
    
    expect(screen.getByText('Manage Your Documents')).toBeInTheDocument();
    expect(screen.getByText('Upload and store important documents like contracts, agreements, and more.')).toBeInTheDocument();
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop document files here or click to upload')).toBeInTheDocument();
    expect(screen.getByText('Uploaded Documents')).toBeInTheDocument();
  });

  test('fetches documents on mount', async () => {
    const mockDocuments = [
      { id: { S: '1' }, name: { S: 'document1.pdf' }, path: { S: '/path/to/document1.pdf' } },
      { id: { S: '2' }, name: { S: 'document2.docx' }, path: { S: '/path/to/document2.docx' } }
    ];

    fetch.mockResolvedValueOnce({
      json: async () => mockDocuments
    });

    render(<DocumentPage />);

    // Verify fetch was called correctly
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/files', {
      headers: {
        Authorization: 'Bearer fake-token'
      }
    });

    // Wait for the documents to be rendered
    await waitFor(() => {
      expect(screen.getByText('document1.pdf')).toBeInTheDocument();
      expect(screen.getByText('document2.docx')).toBeInTheDocument();
    });
  });

  test('shows error message when fetching documents fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<DocumentPage />);

    await waitFor(() => {
      expect(screen.getByText('Erreur lors du chargement des documents.')).toBeInTheDocument();
    });
  });

  test('uploads a file when selected', async () => {
    // Mock successful responses for both fetch calls
    fetch.mockResolvedValueOnce({
      json: async () => []
    }).mockResolvedValueOnce({
      status: 200
    }).mockResolvedValueOnce({
      json: async () => []
    });

    render(<DocumentPage />);

    // Create a file input and simulate file selection
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByAcceptingUpload('.pdf,.txt,.doc,.docx,.odt,.xls,.xlsx');
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Verify the upload fetch was called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer fake-token'
        },
        body: expect.any(FormData)
      });
    });

    // Check that the success message is displayed
    await waitFor(() => {
      expect(screen.getByText('Fichier ajouté !')).toBeInTheDocument();
    });
  });

  test('handles file upload error', async () => {
    // Mock initial fetch success but upload failure
    fetch.mockResolvedValueOnce({
      json: async () => []
    }).mockRejectedValueOnce(new Error('Upload failed'));

    render(<DocumentPage />);

    // Create a file input and simulate file selection
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByAcceptingUpload('.pdf,.txt,.doc,.docx,.odt,.xls,.xlsx');
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText("Erreur lors de l'envoi du fichier.")).toBeInTheDocument();
    });
  });

  test('deletes a document when delete button is clicked', async () => {
    const mockDocuments = [
      { id: { S: '1' }, name: { S: 'document1.pdf' }, path: { S: '/path/to/document1.pdf' } }
    ];

    // Mock successful responses
    fetch.mockResolvedValueOnce({
      json: async () => mockDocuments
    }).mockResolvedValueOnce({
      status: 200
    }).mockResolvedValueOnce({
      json: async () => []  // Empty list after deletion
    });

    render(<DocumentPage />);

    // Wait for the document to render
    await waitFor(() => {
      expect(screen.getByText('document1.pdf')).toBeInTheDocument();
    });

    // Click the delete button
    const deleteButton = screen.getByText('🗑 Supprimer');
    fireEvent.click(deleteButton);

    // Verify that confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Supprimer le fichier avec l\'ID "1" ?');

    // Verify that the delete fetch was called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/upload/1', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer fake-token'
        }
      });
    });

    // Check that the success message is displayed
    await waitFor(() => {
      expect(screen.getByText('Fichier supprimé.')).toBeInTheDocument();
    });
  });

  test('handles delete error', async () => {
    const mockDocuments = [
      { id: { S: '1' }, name: { S: 'document1.pdf' }, path: { S: '/path/to/document1.pdf' } }
    ];

    // Mock successful initial fetch but delete failure
    fetch.mockResolvedValueOnce({
      json: async () => mockDocuments
    }).mockRejectedValueOnce(new Error('Delete failed'));

    render(<DocumentPage />);

    // Wait for the document to render
    await waitFor(() => {
      expect(screen.getByText('document1.pdf')).toBeInTheDocument();
    });

    // Click the delete button
    const deleteButton = screen.getByText('🗑 Supprimer');
    fireEvent.click(deleteButton);

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Erreur lors de la suppression.')).toBeInTheDocument();
    });
  });

  test('handles drag and drop file upload', async () => {
    // Mock successful responses
    fetch.mockResolvedValueOnce({
      json: async () => []
    }).mockResolvedValueOnce({
      status: 200
    }).mockResolvedValueOnce({
      json: async () => []
    });

    render(<DocumentPage />);

    // Create a file and simulate drop event
    const file = new File(['dummy content'], 'dropped.pdf', { type: 'application/pdf' });
    const dataTransfer = {
      files: [file]
    };

    const dropArea = screen.getByText('Drag and drop document files here or click to upload').parentElement;
    
    // Simulate drag over
    fireEvent.dragOver(dropArea, { preventDefault: jest.fn() });
    
    // Simulate drop
    fireEvent.drop(dropArea, { 
      preventDefault: jest.fn(),
      dataTransfer 
    });

    // Verify the upload fetch was called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer fake-token'
        },
        body: expect.any(FormData)
      });
    });

    // Check that the success message is displayed
    await waitFor(() => {
      expect(screen.getByText('Fichier ajouté via glisser-déposer !')).toBeInTheDocument();
    });
  });
});