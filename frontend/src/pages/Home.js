import { useEffect, useState, useRef } from "react";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import useFetch from "../hooks/useFetch";
import FileViewer from "../components/FileViewer";

const Home = (storageRefetchComponent) => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const { storageRefetch } = storageRefetchComponent;

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [fetchedFileData, setFetchedFileData] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const formRef = useRef(null);

  const clearFileInput = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
  };



  const {
    data: fetchedData,
    IsPending,
    error,
    refetch,
  } = useFetch(
    `${process.env.REACT_APP_DEV_API}/api/files/getFiles`,
    user.token
  );

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    setUploadStatus(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_DEV_API}/api/files/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const responseData = await response.json();
      setUploadedFile(responseData);

      console.log("response data:" + responseData);
      setStatus("success");
      refetch();

    } catch (error) {
      console.error("Error uploading file:", error.message);
      setStatus("error");
    } finally {
      setUploadStatus(false);
      storageRefetch();
    }
  };

  // Update fetchedFileData when fetchedData changes

  useEffect(() => {
    setFetchedFileData(fetchedData);
  }, [fetchedData]);

  const handleRefresh = () => {
    refetch();
  };

  const [query, setQuery] = useState("");

  const handleSearch = () => {
    fetch(
      `${
        process.env.REACT_APP_DEV_API
      }/api/files/search?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setFetchedFileData(data);
      })
      .catch((error) => console.error("Error searching:", error));
  };

  return (
    <div className="home">
      <div className="container">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            onClick={handleSearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
            &nbsp; Search in <strong>DataLoom</strong>
          </button>
        </div>

        <div class="container text-center">
          <div class="row row row-cols-auto">
            <div class="col">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Upload File
              </button>
            </div>
            <div class="col">
              <button
                type="button"
                class="btn btn-outline-secondary"
                onClick={handleRefresh}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-arrow-clockwise"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                  ></path>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"></path>
                </svg>
                <strong>Refresh</strong>
              </button>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Choose File To Upload
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={clearFileInput}
                ></button>
              </div>
              <div className="modal-body">
                {status === "uploading" && <p>Uploading...</p>}
                {status === "success" && <p>File uploaded successfully!</p>}
                {status === "error" && (
                  <p>Error uploading file. Please try again.</p>
                )}
                {!uploadStatus && (
                  <div className="input-group mb-3">
                    <input
                      type="file"
                      className="form-control"
                      id="inputGroupFile02"
                      onChange={handleFileChange}
                      ref={formRef}
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {!uploadStatus && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={clearFileInput}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleFileUpload}
                  disabled={uploadStatus}
                >
                  {uploadStatus ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />

      <FileViewer
        fileData={fetchedFileData}
        IsPending={IsPending}
        error={error}
      />
    </div>
  );
};

export default Home;
