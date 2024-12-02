# SkillBridge
## Overview
This project is a streamlined version of SkillBridge, designed to help employees track their skills and set learning goals through an intuitive, user-friendly interface.
## Core Features
### User Authentication
- Description:
  A straightforward authentication system with a single user type.
- Features:
    - Users can sign up/login using email/password.
    - Basic user profiles containing name and role/position.
    - Protected routes accessible only to authenticated users.
### Skills Dashboard
- Description:
  A clean, focused interface for managing personal skills.
- Features:
    - View personal skill matrix.
    - Add/edit skills from a predefined list.
    - Rate skills using a simple 3-level scale (Beginner, Intermediate, Advanced).
    - Group skills by categories such as Technical and Soft Skills.
    - Visual representation of skills (e.g., a radar chart).
### Learning Goals
- Description:
  A simple system for setting and tracking learning objectives linked to skills.
- Features:
    - Create learning goals tied to specific skills.
    - Define target skill levels.
    - Add notes or resources for each goal.
    - Mark goals as complete.
    - View all learning goals in a simple dashboard.
## Technical Details
### Frontend
- Framework: Next.js
- Styling: Responsive design using Tailwind CSS.
- Component Library: Reusable components from ShadCN.
- Type Safety: Ensured through TypeScript.
- UI:
    - Simple and clean, focusing on usability.
    - Includes one primary data visualization (e.g., a skill radar chart).
### Backend
- API Layer: Implemented with tRPC using 3-4 key procedures for core functionality.
- Authentication: Configured with NextAuth for secure login and protected routes.
- Database:
    - Managed using Prisma ORM with a simple, well-structured schema.
    - Fully type-safe integration across the stack.
## Installation
### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (recommended for Prisma)
### Steps
- Clone the Repository:</br>
  `git clone https://github.com/your-repo/skillbridge.git` </br>
  `cd skillbridge`
- Install Dependencies:</br>
  `pnpm install`
- Environment Variables:<br/>
Create a .env file in the root directory with the following:</br>
`DATABASE_URL=your_database_url </br>NEXTAUTH_SECRET=your_secret_key </br>NEXTAUTH_URL=http://localhost:3000 </br>
- Database Setup:
  Run the Prisma migrations:</br>
  `npx prisma migrate dev`</br>`pnpm run dev`  


  
