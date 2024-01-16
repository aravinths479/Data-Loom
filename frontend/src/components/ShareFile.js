import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const ShareFile = ({ fileName, fileId }) => {
  const { user } = useAuthContext();

  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleShare = () => {
    // Validate the email (you may want to use a more robust validation method)
    if (email.trim() === "") {
      setError("Please enter a valid email address");
      return;
    }

    // Assuming you have a server endpoint for sharing files
    const shareEndpoint = `${process.env.REACT_APP_DEV_API}/api/files/share-file`;

    // Make a POST request to share the file
    fetch(shareEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        sharedToUserEmail: email,
        fileId: fileId,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to share file");
        }

        // Handle success, close the modal, or perform other actions
        console.log(data);
        setSuccess(data.message);
      })
      .catch((error) => {
        console.error("Error sharing file:", error.message);
        setError(error.message);
      });

    // Clear the email input field and reset errors after a short delay
    setEmail("");
    setTimeout(() => setError(""), 3000);
  };

  return (
    <div>
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#shareModel${fileId}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-share"
          viewBox="0 0 16 16"
        >
          <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"></path>
        </svg>
      </button>

      <div
        class="modal fade"
        id={`shareModel${fileId}`}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                <strong>Share File</strong>
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="modal-body">
                <label htmlFor="email" className="form-label">
                  Enter Email:
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            </div>
            <div className="container">
              {success !== "" && (
                <div
                  class="alert alert-success alert-dismissible fade show"
                  role="alert"
                >
                  {success}

                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              )}
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={handleShare}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareFile;
