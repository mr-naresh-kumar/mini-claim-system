<<<<<<< HEAD
# Mini Claim System Backend

A Node.js + Express + MongoDB backend for managing employee claims with business rules and receipt uploads.

## Tech Stack
- **Node.js + Express**
- **MongoDB (Mongoose)**
- **JWT Authentication**
- **Joi Validation**
- **Multer** (File upload)
- **Bcryptjs** (Password hashing)

## Folder Structure
```
src/
 ├── controllers/    # API handlers
 ├── models/         # Mongoose schemas
 ├── routes/         # Express routes
 ├── middleware/     # Auth, error, upload, async handlers
 ├── utils/          # Validation schemas, custom error
 ├── config/         # Database connection
 └── app.js          # Entry point
```

## Setup Instructions
1. Clone the repository.
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory (refer to `.env.example` or below).
4. Start the server: `npm start` (or `npm run dev` if nodemon is installed).

## Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/claim-system

```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register`: Register a new user (employee).
- `POST /api/v1/auth/login`: Login user and receive JWT.
- `GET /api/v1/auth/me`: Get current logged-in user profile (Protected).

### Claims
- `POST /api/v1/claims`: Create a new claim (Protected).
  - Business Rules:
    - `claimType`: DOCTOR, PHARMACY, LAB, COMBINED.
    - `amount`: Numeric value.
    - `receipts`: Multipart file upload.
    - Rules:
      - All types need at least 1 receipt.
      - `COMBINED` requires at least 2 receipts.
- `GET /api/v1/claims`: Get all claims of logged-in user (Protected).
  - Query params: `status`, `page`, `limit`.

## Pagination and Filtering
- Filtering: `GET /api/v1/claims?status=PENDING`
- Pagination: `GET /api/v1/claims?page=1&limit=5`

## Error Handling
The backend uses a global error handling middleware to provide consistent JSON error responses.
- `400 Bad Request`: Validation errors (Joi/Mongoose).
- `401 Unauthorized`: Authentication errors.
- `404 Not Found`: Resource not found.
## AWS Deployment (AWS EC2 / ECS)

### 1. Dockerize the App
The project includes a `Dockerfile`. You can build and push the image to AWS ECR:
```bash
docker build -t claim-system-backend .
```

### 2. Database (MongoDB Atlas)
For production, do not use local MongoDB.
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get the Connection String.
3. Update `MONGODB_URI` in your AWS Environment Variables.

### 3. Deployment Options
- **AWS App Runner**: The easiest way. Point it to your GitHub repo or Docker image.
- **AWS EC2**: 
  1. Launch a T2.micro instance (Amazon Linux 2).
  2. Install Docker: `sudo yum install docker -y && sudo service docker start`.
  3. Clone the repo and run: `docker build -t backend . && docker run -p 80:5000 backend`.
- **AWS Elastic Beanstalk**: Use the Docker platform and upload the project.

### 4. File Storage
For a real production app, receipt uploads should be moved to **AWS S3** instead of local storage. You can update `uploadMiddleware.js` to use `multer-s3`.
=======
# mini-claim-system
assignement
>>>>>>> 150f31ed103c1a6c576b4c884dda837925f05786
