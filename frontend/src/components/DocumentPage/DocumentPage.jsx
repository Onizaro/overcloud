import React, { useState, useEffect } from 'react';
import './DocumentPage.css';

function DocumentPage() {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchDocuments = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/files', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const data = await res.json();
      // Extraction des valeurs .S
      const cleanData = data.map((doc) => ({
        name: doc.name.S,
        path: doc.path.S,
        id: doc.id.S
      }));
      setDocuments(cleanData);
    } catch (error) {
      setMessage('Erreur lors du chargement des documents.');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      setMessage('Fichier ajouté !');
      fetchDocuments();
    } catch (error) {
      setMessage('Erreur lors de l’envoi du fichier.');
    }
  };

  const handleDelete = async (id) => {  // Changer filename en id
    const confirmed = window.confirm(`Supprimer le fichier avec l'ID "${id}" ?`);
    if (!confirmed) return;

    try {
      await fetch(`http://localhost:3000/api/upload/${id}`, {  // Utiliser id
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        },
      });


      setMessage('Fichier supprimé.');
      fetchDocuments();
    } catch (error) {
      setMessage('Erreur lors de la suppression.');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });
      setMessage('Fichier ajouté via glisser-déposer !');
      fetchDocuments();
    } catch (error) {
      setMessage('Erreur lors du dépôt de fichier.');
    }
  };

  return (
    <div className="document-page">
      <h1>Manage Your Documents</h1>
      <p>Upload and store important documents like contracts, agreements, and more.</p>

      <button
        className="upload-button"
        onClick={() => document.getElementById('fileInput').click()}
      >
        Upload Document
      </button>
      <input
        id="fileInput"
        type="file"
        accept=".pdf,.txt,.doc,.docx,.odt,.xls,.xlsx"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      <div className="drag-drop-area" onDragOver={handleDragOver} onDrop={handleDrop}>
        <p>Drag and drop document files here or click to upload</p>
      </div>

      <div className="document-list">
        <h2>Uploaded Documents</h2>
        <ul>
          {documents.map((file) => (
            <li key={file.id}>
              <a
                href={file.path}
                target="_blank"
                rel="noopener noreferrer"
                download={file.name}
              >
                {file.name}
              </a>
              <button onClick={() => handleDelete(file.id)}>🗑 Supprimer</button>
            </li>
          ))}
        </ul>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default DocumentPage;
