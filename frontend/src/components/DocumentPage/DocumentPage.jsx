import React from 'react';
import './DocumentPage.css';

function DocumentPage() {
  const handleFileUpload = (event) => {
    const files = event.target.files;
    console.log("Files uploaded:", files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    console.log("Files dropped:", files);
  };

  return (
    <div className="document-page">
      <h1>Manage Your Documents</h1>
      <p>Upload and store important documents like contracts, agreements, and more.</p>

      <button className="upload-button" onClick={() => document.getElementById('fileInput').click()}>
        Upload Document
      </button>
      <input
        id="fileInput"
        type="file"
        accept=".pdf"
        multiple
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      <div
        className="drag-drop-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p>Drag and drop PDF files here or click to upload</p>
      </div>
    </div>
  );
}

export default DocumentPage;
