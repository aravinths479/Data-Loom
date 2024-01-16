import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const Storage = () => {
  const { user } = useAuthContext();

  const [usedStorageMB, setUsedStorage] = useState(0);
  const [percentageUsed, setPercentageUsed] = useState(0);
  const [totalStorage, setTotalStorage] = useState(0);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_DEV_API}/api/files/getUserStorage`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user?.token}`, // Use optional chaining
              // Add any other necessary headers
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch storage data");
        }

        const data = await response.json();

        // Assuming data is the response object
        const { usedStorageMB, totalStorage, percentageUsed } = data;

        setUsedStorage(usedStorageMB || 0);
        setTotalStorage(totalStorage || 0);
        setPercentageUsed(percentageUsed.toFixed(2) || 0);

      } catch (error) {
        console.error("Error fetching storage data:", error);
        // Handle error state if needed
      }
    };

    // Check if user and user.token are truthy before making the API request
    if (user?.token) {
      fetchData(); // Call the async function
    }
  }, [user.token]); 

  return (
    <div className="container">
      <strong> <center>{percentageUsed}% Storage Used of {totalStorage} MB</center></strong>
      <div className="progress" role="progressbar" aria-label="Storage Usage">
        <div
          className="progress-bar"
          style={{ width: `${percentageUsed}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Storage;
