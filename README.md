# Data Loom - Google Drive Clone

Data Loom is a full-fledged cloud storage application that replicates the functionality of Google Drive. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and incorporating AWS services, the project follows a microservices architecture for enhanced scalability and efficient data management.

## Features

- **User Authentication:** Secure user authentication and authorization mechanisms.
- **File Upload and Storage:** Seamlessly upload, organize, and manage files in the cloud.
- **Microservices Architecture:** Utilizes microservices for modular, scalable, and maintainable architecture.
- **AWS Integration:** Integration with AWS services for robust and scalable cloud infrastructure.
- **Responsive UI:** User-friendly and responsive user interface for an optimal user experience.

## Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Cloud Services:** AWS (Amazon S3, EC2, etc.)
- **Microservices:** Docker, Kubernetes (optional)

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/Data-Loom.git
   cd Data-Loom
   ```

2. **Install Dependencies:**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Set Up AWS Credentials:**
   - Obtain AWS credentials (Access Key ID, Secret Access Key).
   - Configure AWS credentials in the appropriate environment files.

4. **Run the Application:**
   - Start the frontend:
     ```bash
     cd client && npm start
     ```
   - Start the backend:
     ```bash
     cd server && npm start
     ```

5. **Access the Application:**
   Open your web browser and go to [http://localhost:3000](http://localhost:3000) to access the Data Loom application.
