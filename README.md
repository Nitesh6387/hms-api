# Hospital Management System - Backend API

A production-ready RESTful API for a Hospital Management System built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

### Security
- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ JWT authentication with secure secrets
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation with Zod
- ✅ Password reset with token expiration
- ✅ No sensitive data in responses

### Architecture
- ✅ Service layer pattern
- ✅ Centralized error handling
- ✅ Request logging with Winston
- ✅ Environment-based configuration
- ✅ TypeScript with strict typing
- ✅ Soft delete pattern
- ✅ Async/await error handling

### Functionality
- ✅ User authentication (Patient, Doctor, Admin)
- ✅ Role-based access control
- ✅ Doctor management (CRUD)
- ✅ Patient management (CRUD)
- ✅ Department management
- ✅ Appointment booking & management
- ✅ Appointment scheduling with conflict detection
- ✅ Doctor availability management
- ✅ Password reset functionality
- ✅ Dashboard statistics
- ✅ Profile management for all roles

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT
- **Security:** Helmet, bcrypt
- **Validation:** Zod
- **Logging:** Winston
- **File Upload:** express-fileupload

## Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 12.x
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HospitalManagement/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=hms

   # JWT
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRY=2h

   # Server
   PORT=9000
   NODE_ENV=development

   # Email (for password reset)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@hospital.com

   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb hms
   ```

5. **Run database migrations** (if using migrations)
   ```bash
   npm run migration:run
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:9000`

## API Endpoints

### Authentication
- `POST /v1/api/login` - User login
- `POST /v1/api/register` - User registration
- `POST /v1/api/forget-password` - Request password reset
- `POST /v1/api/reset-password` - Reset password with token

### Admin Routes (Requires Admin Token)
- `GET /v1/api/admin/patients` - Get all patients
- `DELETE /v1/api/admin/removePatient/:id` - Remove patient
- `PUT /v1/api/admin/patient/:id` - Update patient
- `PATCH /v1/api/admin/patient/:id/activate` - Activate patient

- `GET /v1/api/admin/doctors` - Get all doctors
- `POST /v1/api/admin/doctor` - Add doctor
- `PUT /v1/api/admin/doctor/:id` - Update doctor
- `DELETE /v1/api/admin/doctor/:id` - Delete doctor
- `GET /v1/api/admin/doctor/:id` - Get single doctor

- `GET /v1/api/admin/appointments` - Get all appointments
- `GET /v1/api/admin/getappointmentdata` - Get appointments with filters
- `GET /v1/api/admin/appointment/:id` - Get appointment by ID
- `PUT /v1/api/admin/appointment/:id` - Update appointment
- `PATCH /v1/api/admin/appointment/:id/status` - Update appointment status

- `GET /v1/api/admin/departments` - Get all departments
- `POST /v1/api/admin-add-department` - Add department
- `PUT /v1/api/admin/department/:id` - Update department
- `DELETE /v1/api/admin-delete-department` - Delete department

- `GET /v1/api/admin/stats` - Get dashboard statistics

### Doctor Routes (Requires Doctor Token)
- `GET /v1/api/doctor/profile` - Get doctor profile
- `PUT /v1/api/doctor/profile` - Update doctor profile
- `PUT /v1/api/doctor/availability` - Update availability

- `GET /v1/api/doctor/appointments` - Get doctor's appointments
- `GET /v1/api/doctor/appointment/:id` - Get appointment by ID
- `PATCH /v1/api/doctor/appointment/:id/status` - Update appointment status

### Patient Routes (Requires Patient Token)
- `POST /v1/api/doctor-appointment-book` - Book appointment
- `GET /v1/api/get-appointment-by-patientId` - Get patient's appointments
- `DELETE /v1/api/delete-appointment` - Delete appointment

- `GET /v1/api/patient/profile` - Get patient profile
- `PUT /v1/api/patient/profile` - Update patient profile
- `PUT /v1/api/patient/change-password` - Change password

- `GET /v1/api/patient/appointment/:id` - Get appointment by ID
- `PATCH /v1/api/patient/appointment/:id/cancel` - Cancel appointment
- `PUT /v1/api/patient/appointment/:id/reschedule` - Reschedule appointment

### Public Routes
- `GET /v1/api/departments` - Get all departments
- `GET /v1/api/get-doctor-by-departmentId` - Get doctors by department
- `GET /health` - Health check endpoint

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "error": false
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": true
}
```

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Security Features

1. **Password Security**
   - Bcrypt hashing with 10 salt rounds
   - Minimum 6 characters
   - Never returned in API responses

2. **JWT Tokens**
   - 2-hour expiration
   - Secure secret from environment variables
   - Contains user ID, email, and user type

3. **Input Validation**
   - Zod schema validation
   - Email format validation
   - Phone number validation
   - Required field checks

4. **Rate Limiting**
   - 3 requests per minute on login endpoint
   - Prevents brute force attacks

5. **CORS**
   - Configurable allowed origins
   - Credentials support
   - Restricted methods and headers

## Logging

All requests and errors are logged using Winston:
- Request logs: `logs/combined.log`
- Error logs: `logs/error.log`
- Console output in development mode

## Error Handling

All errors are caught and formatted consistently:
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/missing token)
- 404: Not Found
- 409: Conflict (duplicate entries)
- 500: Internal Server Error

## Database Schema

### Tables
- **Admin** - Admin users
- **Doctor** - Doctor users with availability
- **Patient** - Patient users
- **Department** - Hospital departments
- **AppointmentTbl** - Appointment records

### Key Features
- UUID primary keys
- Soft delete pattern (isDeleted flag)
- Timestamps (createdAt, updatedAt)
- Foreign key relationships

## Development

### Scripts
```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Project Structure
```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── env.config.ts
│   │   └── logger.ts
│   ├── controllers/      # Route controllers
│   │   ├── AdminController/
│   │   ├── DoctorController/
│   │   ├── PatientController/
│   │   └── common/
│   ├── DbConfig/         # Database configuration
│   ├── Entities/         # TypeORM entities
│   ├── Helpers/          # Helper functions
│   ├── middleware/       # Express middleware
│   ├── routes/           # Route definitions
│   ├── utils/            # Utility functions
│   ├── validators/       # Zod validation schemas
│   └── index.ts          # Application entry point
├── logs/                 # Log files (auto-generated)
├── uploads/              # Uploaded files
├── .env.example          # Environment variables template
└── package.json
```

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set NODE_ENV=production**
   ```bash
   export NODE_ENV=production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Environment Variables for Production
- Use strong JWT_SECRET (minimum 32 characters)
- Use strong database passwords
- Configure proper CORS_ORIGIN
- Set up email service for password reset
- Enable database logging only in development

## API Testing

Test the API using Postman, Insomnia, or curl:

```bash
# Health check
curl http://localhost:9000/health

# Login
curl -X POST http://localhost:9000/v1/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "password",
    "userType": "admin"
  }'
```

## Contributing

1. Follow TypeScript best practices
2. Use async/await for all async operations
3. Add proper error handling
4. Log all errors and important events
5. Validate all inputs with Zod schemas
6. Never commit sensitive data
7. Write clear commit messages

## License

ISC

## Support

For issues and questions, please contact the development team.