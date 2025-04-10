import React, { useState, useEffect } from 'react';
import './DocumentPage.css';

function DocumentPage() {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchDocuments = async (token) => {
    try {
      const res = await fetch('http://15.237.220.104:3000/api/files', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const data = await res.json();

      const cleanData = data.map((doc) => ({
        name: doc.Key,
        id: doc.Key
      }));
      setDocuments(cleanData);
    } catch (error) {
      setMessage('Erreur lors du chargement des documents.');
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      setMessage('Vous devez être connecté pour accéder à cette page.');
      return; // Empêche le chargement des documents si pas de token
    }
    fetchDocuments(token);
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('originalname', file.name);

    try {
      await fetch('http://15.237.220.104:3000/api/upload', {
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

  const handleDelete = async (id) => {
    const confirmed = window.confirm(`Supprimer le fichier "${id}" ?`);
    if (!confirmed) return;

    try {
      await fetch(`http://15.237.220.104:3000/api/upload/${id}`, {
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

  const handleDownload = async (id) => {
    try {
      const res = await fetch(`http://15.237.220.104:3000/api/files/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        setMessage('URL signée non reçue.');
      }
    } catch (error) {
      setMessage("Erreur lors de la récupération de l'URL signée.");
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
    formData.append('originalname', file.name);

    try {
      await fetch('http://15.237.220.104:3000/api/upload', {
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
              <button onClick={() => handleDownload(file.id)}>{file.name}</button>
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
