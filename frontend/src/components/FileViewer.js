import React from "react";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import ShareFile from "./ShareFile";
import Loading from "./Loading";

const FileViewer = ({ fileData, isPending, error, refetch }) => {
  const { user } = useAuthContext();

  const [pendingDelete, setPendingDelete] = useState("");

  const confirmDelete = (fileId, fileName, fileType) => {
    handleDelete(fileId, fileName, fileType);
  };

  const handleDelete = async (fileId, fileName, fileType) => {
    if (!user) {
      return;
    }
    setPendingDelete("File Deletion Pending. Please Wait !");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DEV_API}/api/files/deleteFile/${fileId}/${fileName}/${fileType}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        setPendingDelete("File Deleted Sucessfully");
      } else {
        setPendingDelete("Error Deleting File. Try again later");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("An error occurred while deleting the file.");
    }
  };

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
    <div className="container">
    {/* <center>
        {fileData === null && <Loading />}
        {fileData !== null && fileData.length === 0 && <p>No files found</p>}
      </center> */}

      {fileData  && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>File Name</th>
              <th>File Type</th>
              <th>File Size</th>
              <th>Open</th>
              <th>Delete</th>
              <th>Share File</th>
            </tr>
          </thead>
          <tbody>
            {fileData &&
              fileData.map((file) => (
                <tr key={file.fileId}>
                  <td>{file.fileName}</td>
                  <td>{file.fileType}</td>
                  <td>{file.fileSize} MB</td>
                  <td>
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
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Click to open in a new tab or downlaod
                            </a>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            {file.fileName}
                          </h1>
                          <br />
                            {renderFileContent(file)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target={`#exampleModal${file.fileId}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        classNameName="bi bi-trash-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"></path>
                      </svg>
                    </button>

                    <div
                      className="modal fade"
                      id={`exampleModal${file.fileId}`}
                      tabindex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-body">
                            Are you sure want to delete this file{" "}
                            <strong>{file.fileName}</strong>
                            <br />
                          </div>
                          <div className="modal-footer">
                            {pendingDelete !== "" && (
                              <div
                                class="alert alert-success alert-dismissible fade show"
                                role="alert"
                              >
                                {pendingDelete}

                                <button
                                  type="button"
                                  class="btn-close"
                                  data-bs-dismiss="alert"
                                  aria-label="Close"
                                ></button>
                              </div>
                            )}
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() =>
                                confirmDelete(
                                  file.fileId,
                                  file.fileName,
                                  file.fileType
                                )
                              }
                            >
                              Confirm Delete
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <ShareFile fileId={file.fileId} fileName={file.fileName} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FileViewer;
