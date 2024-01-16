const SharedFilesViewer = ({ file }) => {
  const renderFileContent = (file) => {
    const { fileType, fileUrl, fileName } = file;

    switch (fileType.toLowerCase()) {
      case "image":
      case "jpg":
      case "png":
      case "jpeg":
      case "jfif":
      case "pjpeg":
      case "pjp":
      case "svg":
      case "gif":
        return <img src={fileUrl} className="img-fluid" alt={fileName} />;
      case "pdf":
        return (
          <iframe
            src={fileUrl}
            title={fileName}
            width="100%"
            height="600px"
            frameBorder="0"
          ></iframe>
        );
      case "docx":
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
              fileUrl
            )}`}
            title={fileName}
            width="100%"
            height="600px"
            frameBorder="0"
          ></iframe>
        );
      case "mp3":
        return (
          <audio controls>
            <source src={fileUrl} type="audio/mp3" />
          </audio>
        );
      case "mp4":
        return (
          <video controls width="100%" height="400px">
            <source src={fileUrl} type="video/mp4" />
          </video>
        );
      case "txt":
        // Displaying text content directly
        return <pre>{fileUrl}</pre>;
      case "csv":
        // CSV content can be displayed in a table
        return (
          <iframe
            src={fileUrl}
            title={fileName}
            width="100%"
            height="400px"
            frameBorder="0"
          ></iframe>
        );
      case "html":
        // Displaying HTML content directly
        return (
          <iframe
            srcDoc={fileUrl}
            title={fileName}
            width="100%"
            height="600px"
            frameBorder="0"
          ></iframe>
        );
      // Add more cases for other file types as needed
      default:
        return (
          <p>
            Unsupported file type.{" "}
            <a href={fileUrl} target="_blank" rel="noreferrer">
              Click to downlaod
            </a>{" "}
          </p>
        );
    }
  };
  return (
    <>
      <button
        type="button"
        data-bs-toggle="modal"
        data-bs-target={`#fileOpen${file.fileId}`}
        style={{
          textDecoration: "underline",
          color: "blue",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        Open &nbsp;
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-folder2-open"
          viewBox="0 0 16 16"
        >
          <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z"></path>
        </svg>
      </button>
      <div
        className="modal fade"
        id={`fileOpen${file.fileId}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {file.fileName}
              </h1>
              <a href={file.fileUrl} target="_blank" rel="noreferrer">
                Click to open in a new tab or downlaod
              </a>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{renderFileContent(file)}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SharedFilesViewer;
