import React from 'react';

const FileDownloadButton = ({ s3Url, fileName }) => {
  const handleDownload = () => {
    // Create a temporary link element
    const link = document.createElement('a');
    
    // Set the href attribute to the S3 URL
    link.href = s3Url;

    // Set the download attribute to the desired file name
    link.download = fileName;

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger a click on the link to start the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownload}>
      Download File
    </button>
  );
};

export default FileDownloadButton;
