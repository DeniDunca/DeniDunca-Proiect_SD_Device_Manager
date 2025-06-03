# Online Energy Utility Platform

A full-stack distributed web application for monitoring and managing energy consumption of user devices.

## Architecture Overview

This application follows a **Layered Architecture**:

- **Presentation Layer:** ReactJS frontend, Spring Boot Controllers
- **Application Layer:** Business logic via Services
- **Domain Layer:** Entity models and business rules
- **Infrastructure Layer:** DAO classes and persistence logic

![image](https://github.com/user-attachments/assets/1cf8a854-9492-4350-b872-eed2393c92c8)

## Tech Stack

- **Backend:** Java, Spring Boot
- **Frontend:** ReactJS
- **Database:** PostgreSQL
- **Messaging:** RabbitMQ
- **Security:** JWT (JSON Web Token)
- **Real-Time Updates:** WebSocket
- **Deployment:** Docker, Azure DevOps (Frontend)

## Authentication & Authorization

JWT tokens are used to secure the REST API.

- `AuthenticationController` issues tokens
- `JwtAuthFilter` validates requests
- `JwtUtils` generates and verifies tokens
- `SecurityConfig` manages CORS, CSRF, and security rules
- `UserDetails` integration in the User model
- Frontend adds the JWT token in the `Authorization` header

## User Roles

### Admin
- Create, read, update, delete users and devices
- Assign devices to users
- View and chat with users in real-time

### Client
- View energy usage by device and date
- Receive alerts when consumption exceeds limit
- Chat with admin in real-time

![image](https://github.com/user-attachments/assets/3ebdca80-e26a-48a2-b6c0-1296f089873f)


## Database Design

![image](https://github.com/user-attachments/assets/8bf656af-b21c-47f3-9862-ce0253546739)

Relationships:
- `Role` ↔ `User`: one-to-many
- `User` ↔ `Device`: one-to-many
- `Device` ↔ `Consumption`: one-to-many

## RabbitMQ Integration

- **Producer App:**
  - Reads a CSV file
  - Sends JSON-formatted messages to RabbitMQ

- **Backend Consumer:**
  - Connects to RabbitMQ
  - Parses messages
  - Stores data in `Consumption` table

## WebSocket Notifications

- Configured using `WebSocketConfig` and SockJS
- Real-time updates on:
  - Energy consumption
  - Alerts for max energy exceeded
  - Chat typing indicators and message status
 
![image](https://github.com/user-attachments/assets/d5e1cbb5-cbec-44ab-aa3a-00696692ebaa)

## Chat Feature

Implemented fully via WebSockets.

- Admin sees list of users who sent messages
- Admin and users can chat in real-time
- "Typing" and "seen" notifications included

## Docker Deployment

### Local Setup

```bash
docker-compose build
docker-compose up
```
- **Backend:** Java + PostgreSQL
- **Frontend:** ReactJS

![image](https://github.com/user-attachments/assets/07160561-a347-40f8-b8ff-59ba3a5a67a8)

## Development Tools

- **Backend IDE:** IntelliJ IDEA
- **Frontend IDE:** WebStorm
- **Database Management:** PGAdmin 4
- **API Testing:** Postman
---
Developed by **Dunca Denisa-Mihaela**, 30643  
Faculty of Computer Automation and Computer Science
