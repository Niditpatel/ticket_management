# Ticket Management System

A modern web application for managing support tickets and organizing team workflows. Create, assign, track, and resolve tickets with an intuitive user interface and powerful backend system.

## What This Project Does

This is a ticket management platform designed to help teams:

- **Create & Manage Tickets**: Easily create new support tickets with detailed descriptions
- **Track Progress**: Monitor ticket status through different stages (Open → In Progress → Resolved)
- **Set Priorities**: Organize work by setting priority levels (Low, Medium, High)
- **Assign Work**: Assign tickets to team members and manage user access
- **Collaborate**: Keep all ticket information centralized and accessible

Perfect for support teams, project managers, or anyone who needs to organize work and track issues.

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Redux Toolkit for state management
- React Router for navigation
- Axios for API communication
- Radix UI components for a polished interface

**Backend:**
- Node.js with Express
- MongoDB with Mongoose for data storage
- JWT for authentication
- Bcrypt for password encryption
- CORS for cross-origin requests

## Project Structure

```
ticket_management/
├── client/              # React frontend application
│   ├── src/
│   │   ├── pages/       # Main app pages (Create, Edit, List, User Management)
│   │   ├── components/  # Reusable UI components
│   │   ├── store/       # Redux state management
│   │   └── api/         # API communication
│   └── package.json
│
└── server/              # Express backend API
    ├── models/          # MongoDB schemas (Ticket, User)
    ├── routes/          # API endpoints
    │   ├── ticketRoutes.js
    │   └── userRoutes.js
    └── index.js         # Server entry point
```

## Getting Started

### Prerequisites

Before you start, make sure you have:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local instance or MongoDB Atlas account) - [Get MongoDB](https://www.mongodb.com/)
- A code editor like VS Code
- Git (optional, for cloning)

### Important: Environment Variables

⚠️ **Never commit sensitive information to Git!**
- The .env file is protected by .gitignore and should never be pushed to version control
- Use `.env.example` as a template - it's safe to commit
- Always copy `.env.example` to `.env` before running the project
- Update the values in `.env` with your actual configuration

### Installation & Setup

#### 1. Clone or Download the Project

```bash
cd ticket_management
```

#### 2. Set Up the Backend Server

```bash
cd server

# Install dependencies
npm install

# Copy the .env.example file to .env
# On Windows:
copy .env.example .env

# On Mac/Linux:
cp .env.example .env

# Edit the .env file with your configuration:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/ticket_management
# JWT_SECRET=your_secret_key_here

# Start the server
npm start
```

The backend will run on `http://localhost:5000`

#### 3. Set Up the Frontend

In a new terminal window:

```bash
cd client

# Install dependencies
npm install

# Copy the .env.example file to .env.local
# On Windows:
copy .env.example .env.local

# On Mac/Linux:
cp .env.example .env.local

# The default API URL is set to http://localhost:5000/api
# If your backend runs on a different port, edit .env.local:
# VITE_API_URL=http://localhost:YOUR_PORT/api

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173/` (or another port if 5173 is in use)

Open your browser and navigate to the URL shown in the terminal.

## Available Commands

### Frontend (client folder)

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview the production build
npm run lint     # Check code for style issues
```

### Backend (server folder)

```bash
npm start        # Start the server
```

## Features

✨ **Ticket Management**
- Create new tickets with title and description
- Edit existing tickets
- View all tickets in a organized list
- Filter and sort tickets by status and priority

🎯 **Priority & Status**
- Set ticket priority (Low, Medium, High)
- Track ticket lifecycle (Open → In Progress → Resolved)
- Update status as work progresses

👥 **User Management**
- Create and manage team members
- Assign tickets to specific users
- Track who's working on what

🔒 **Security**
- JWT-based authentication
- Password encryption with Bcrypt
- Secure API communication

## How to Use

1. **Start the Application**: Follow the setup steps above
2. **Create a User**: Go to User Management to add team members
3. **Create a Ticket**: Click "Create Ticket" and fill in the details
4. **Assign Work**: Assign tickets to team members
5. **Update Status**: Change ticket status as work progresses
6. **View Dashboard**: See all tickets and their current status

## API Endpoints (Backend)

### Tickets
- `GET /api/tickets` - Get all tickets
- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets/:id` - Get a specific ticket
- `PUT /api/tickets/:id` - Update a ticket
- `DELETE /api/tickets/:id` - Delete a ticket

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get a specific user
- `PUT /api/users/:id` - Update a user profile
- `DELETE /api/users/:id` - Delete a user

## Troubleshooting

**Backend won't start?**
- Make sure MongoDB is running
- Check that port 5000 is not in use
- Verify `.env` file is created with correct values

**Frontend shows connection errors?**
- Ensure the backend server is running on port 5000
- Check your browser console for detailed errors
- Clear browser cache and try again

**Dependencies failing to install?**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Make sure you're using Node.js 16 or higher

## Next Steps

- Customize the styling with Tailwind CSS
- Add more ticket fields (tags, attachments, etc.)
- Implement email notifications
- Add role-based access control
- Deploy to production

## Support

If you run into issues:
1. Check the error messages in the browser console (frontend)
2. Check the terminal output (backend)
3. Ensure all prerequisites are installed correctly
4. Try restarting both the frontend and backend servers

---

**Happy ticket managing!** 🎉
