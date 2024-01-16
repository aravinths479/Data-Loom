import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import SharedFilesViewer from "./SharedFilesViewer";

const SharedWithMe = () => {
  const { user } = useAuthContext();
  const [sharedFiles, setSharedFiles] = useState([]);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const fetchSharedFiles = async () => {
      try {
        setIsPending(true);
  
        if (!user || !user.token) {
          // Handle the case where user or user.token is not available
          throw new Error("User or token not available");
        }
  
        const response = await fetch(
          `${process.env.REACT_APP_DEV_API}/api/files/shared-with-me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch shared files");
        }
  
        const data = await response.json();
        setSharedFiles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsPending(false);
      }
    };
  
    fetchSharedFiles();
  }, [user]);
  

  return (
    <div className="container mt-4">
      {isPending && <p>Loading...</p>}
      {sharedFiles.length === 0 && <p>No shared files found.</p>}
      {sharedFiles.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Shared By</th>
              <th>Share Timestamp</th>
              <th>File Type</th>
              <th>File Size</th>
              <th>File URL</th>
            </tr>
          </thead>
          <tbody>
            {sharedFiles.map((file) => (
              <tr key={file.fileId}>
                <td>{file.fileName}</td>
                <td>{file.sharedByUserEmail}</td>
                <td>{file.shareTimestamp}</td>
                <td>{file.fileType}</td>
                <td>{file.fileSize} MB</td>
                <td>
                <SharedFilesViewer file={file}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SharedWithMe;
