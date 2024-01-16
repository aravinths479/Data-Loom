import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const RecycleBin = () => {
  const { user } = useAuthContext();
  const [isPending, setIsPending] = useState(true);
  const [recycleBinFiles, setRecycleBinFiles] = useState([]);

  const emptyRecycleBin = async () => {
    try {
      setIsPending(true);

      if (!user || !user.token) {
        // Handle the case where user or user.token is not available
        throw new Error("User or token not available");
      }

      const response = await fetch(
        `${process.env.REACT_APP_DEV_API}/api/files/empty-recycle-bin`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to empty recycle bin");
      }

      // After successfully emptying the recycle bin, fetch updated recycle bin files
      const updatedResponse = await fetch(
        `${process.env.REACT_APP_DEV_API}/api/files/get-recycle-bin`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!updatedResponse.ok) {
        throw new Error("Failed to fetch recycle bin");
      }

      const updatedData = await updatedResponse.json();
      setRecycleBinFiles(updatedData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    const fetchRecycleBinFiles = async () => {
      try {
        setIsPending(true);

        if (!user || !user.token) {
          // Handle the case where user or user.token is not available
          throw new Error("User or token not available");
        }

        const response = await fetch(
          `${process.env.REACT_APP_DEV_API}/api/files/get-recycle-bin`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recycle bin");
        }

        const data = await response.json();
        setRecycleBinFiles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsPending(false);
      }
    };

    fetchRecycleBinFiles();
  }, [user]);

  const restoreFromBin = async (recycleId) => {
    try {
      setIsPending(true);

      if (!user || !user.token) {
        throw new Error("User or token not available");
      }

      const response = await fetch(
        `${process.env.REACT_APP_DEV_API}/api/files/restore-from-recycle-bin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recycleId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to restore file from recycle bin");
      }

      // After successfully restoring the file, fetch updated recycle bin files
      const updatedResponse = await fetch(
        `${process.env.REACT_APP_DEV_API}/api/files/get-recycle-bin`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!updatedResponse.ok) {
        throw new Error("Failed to fetch recycle bin");
      }

      const updatedData = await updatedResponse.json();
      setRecycleBinFiles(updatedData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };



  return (
    <div className="container mt-4">
      <button
        type="button"
        className="btn btn-outline-danger"
        onClick={emptyRecycleBin}
      >
        Empty Recycle Bin
      </button>
      <br />
      <br />

      {isPending && <p>Loading...</p>}
      {!isPending && recycleBinFiles.length === 0 && (
        <p>No files found in recycle bin.</p>
      )}
      {!isPending && recycleBinFiles.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>File Name</th>
              <th>File Type</th>
              <th>File Size</th>
              <th>Deleted on</th>
              <th>Restore File</th>
            </tr>
          </thead>
          <tbody>
            {recycleBinFiles.map((file) => (
              <tr key={file.recycleId}>
                <td>{file.fileName}</td>
                <td>{file.fileType}</td>
                <td>{file.fileSize} MB</td>
                <td>{new Date(file.deleteTimestamp).toLocaleString()}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => restoreFromBin(file.recycleId)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-recycle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.5.5 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244z" />
                    </svg>
                    &nbsp;&nbsp;
                    Restore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecycleBin;
