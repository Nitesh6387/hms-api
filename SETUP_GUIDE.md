# Backend Setup Guide - Create First Admin

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ Node.js >= 18.x installed
- ✅ PostgreSQL >= 12.x installed and running
- ✅ PostgreSQL database created (name: `hms`)

## 🚀 Step-by-Step Setup

### Step 1: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

2. Update `.env` with your PostgreSQL credentials:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_postgres_password
   DB_DATABASE=hms

   # JWT Configuration (CHANGE THIS IN PRODUCTION!)
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRY=2h

   # Server Configuration
   PORT=9000
   NODE_ENV=development

   # Email Configuration (optional, for password reset)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@hospital.com

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create PostgreSQL Database

1. Open PostgreSQL (pgAdmin or psql)
2. Create a new database named `hms`:
   ```sql
   CREATE DATABASE hms;
   ```

### Step 4: Create First Admin User

Run the seed script to create the first admin:

```bash
npm run seed:admin
```

**Expected Output:**
```
✅ Admin created successfully!
   Email: admin@hospital.com
   Password: Admin@1234
   ⚠️  Please change the password after first login!
```

**Default Admin Credentials:**
- **Email:** `admin@hospital.com`
- **Password:** `Admin@1234`

⚠️ **IMPORTANT:** Change this password immediately after first login!

### Step 5: Start the Server

```bash
npm run dev
```

The server will start at `http://localhost:9000`

### Step 6: Test the Server

1. **Health Check:**
   ```bash
   curl http://localhost:9000/health
   ```

2. **Login with Admin:**
   ```bash
   curl -X POST http://localhost:9000/v1/api/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@hospital.com",
       "password": "Admin@1234",
       "userType": "admin"
     }'
   ```

## 📝 Manual Admin Creation (Alternative)

If the seed script doesn't work, you can manually create an admin via SQL:

```sql
-- First, hash the password using bcrypt (you need to do this in Node.js)
-- Run this in Node.js to get the hashed password:
const bcrypt = require('bcrypt');
const hashed = await bcrypt.hash('Admin@1234', 10);
console.log(hashed);

-- Then insert the admin:
INSERT INTO "Admin" (name, email, password, contact, address, "isActive", "createdAt", "updatedAt")
VALUES (
  'System Admin',
  'admin@hospital.com',
  '<paste_hashed_password_here>',
  '9999999999',
  'Hospital Admin Office',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
```

## 🔐 Security Notes

1. **Change Default Password:** Always change the default admin password after first login
2. **JWT Secret:** Use a strong, random JWT_SECRET in production (minimum 32 characters)
3. **Database Password:** Use a strong database password in production
4. **CORS Origin:** Update CORS_ORIGIN to your actual frontend URL in production
5. **HTTPS:** Always use HTTPS in production

## 🛠️ Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Verify DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD in .env
- Check if database `hms` exists

### Port Already in Use
- Change PORT in .env file
- Or kill the process using port 9000

### Module Not Found Errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

### TypeScript Errors
- Run `npx tsc --noEmit` to check for errors
- Ensure all dependencies are installed

## 📚 Next Steps

After creating the admin:

1. **Login to the system** using the admin credentials
2. **Create departments** (Cardiology, Neurology, etc.)
3. **Add doctors** with their details and availability
4. **Configure system settings** as needed
5. **Test the API endpoints** using Postman or similar tools

## 🔗 Useful Links

- **API Documentation:** See `README.md`
- **Changelog:** See `CHANGELOG.md`
- **Fixes Applied:** See `FIXES_APPLIED.md`

## 📞 Support

If you encounter any issues:
1. Check the logs in `backend/logs/` directory
2. Review the console output for error messages
3. Ensure all environment variables are correctly set

---

**Status:** ✅ Ready to use  
**Default Admin:** admin@hospital.com / Admin@1234  
**Server URL:** http://localhost:9000