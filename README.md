# Smart Campus Operations Hub

A comprehensive web-based system for managing campus resources, bookings, incident tickets, and user notifications.

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security (OAuth2, JWT)
- Spring Data JPA
- MySQL 8
- Maven
- Lombok

### Frontend
- React 18
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router DOM v6
- Axios
- React Query
- date-fns
- Lucide React icons

## Features

- **Resource Management**: Browse and manage campus facilities and assets
- **Booking System**: Request and manage resource bookings with conflict detection
- **Ticket System**: Report and track campus issues with file attachments
- **Notifications**: Real-time notifications for booking and ticket updates
- **Role-Based Access**: Admin, Technician, and User roles with appropriate permissions
- **OAuth2 Authentication**: Google Sign-In integration with JWT sessions

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 18+
- MySQL 8.0+
- Google OAuth2 Client ID and Secret

## Setup Instructions

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE smart_campus_db;
```

2. Run the schema file:
```bash
mysql -u root -p smart_campus_db < database/schema.sql
```

3. (Optional) Load sample seed data for SLIIT University:
```bash
mysql -u root -p smart_campus_db < database/seed_data.sql
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Update `src/main/resources/application.properties` with your configuration:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_campus_db
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.security.oauth2.client.registration.google.client-id=your_google_client_id
spring.security.oauth2.client.registration.google.client-secret=your_google_client_secret

jwt.secret=your_jwt_secret_min_32_characters
```

3. Build and run the backend:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

4. Run the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5173/login`
5. Copy the Client ID and Client Secret to your configuration files

## Project Structure

### Backend
```
backend/
├── src/main/java/com/smartcampus/
│   ├── config/          # Security and application configuration
│   ├── controller/      # REST controllers
│   ├── exception/       # Global exception handling
│   ├── model/
│   │   ├── dto/        # Request/Response DTOs
│   │   ├── entity/     # JPA entities
│   │   └── enums/      # Enum definitions
│   ├── repository/     # JPA repositories
│   ├── security/       # JWT and OAuth2 security
│   └── service/        # Business logic
└── src/main/resources/
    └── application.properties
```

### Frontend
```
frontend/
├── src/
│   ├── api/            # API client functions
│   ├── components/
│   │   ├── layout/    # Layout components
│   │   ├── shared/    # Reusable components
│   │   └── ui/        # shadcn/ui components
│   ├── context/       # React contexts
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── App.jsx        # Main app with routing
│   └── index.css      # Global styles
```

## API Endpoints

### Authentication
- `POST /api/auth/google` - Exchange OAuth2 code for JWT
- `GET /api/auth/me` - Get current user

### Resources
- `GET /api/resources` - List all resources
- `GET /api/resources/:id` - Get resource details
- `POST /api/resources` - Create resource (Admin)
- `PUT /api/resources/:id` - Update resource (Admin)
- `DELETE /api/resources/:id` - Delete resource (Admin)

### Bookings
- `GET /api/bookings` - List bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create booking request
- `PATCH /api/bookings/:id/approve` - Approve booking (Admin)
- `PATCH /api/bookings/:id/reject` - Reject booking (Admin)
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Tickets
- `GET /api/tickets` - List tickets
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets` - Create ticket with attachments
- `PATCH /api/tickets/:id/status` - Update ticket status
- `PATCH /api/tickets/:id/assign` - Assign technician (Admin)
- `DELETE /api/tickets/:id` - Delete ticket (Admin)

### Comments
- `GET /api/tickets/:id/comments` - List comments
- `POST /api/tickets/:id/comments` - Add comment
- `PUT /api/tickets/:id/comments/:id` - Update comment
- `DELETE /api/tickets/:id/comments/:id` - Delete comment

### Notifications
- `GET /api/notifications` - List notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Users (Admin)
- `GET /api/users` - List all users
- `PATCH /api/users/:id/role` - Update user role

## Running Tests

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm run test
```

## Building for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist`

## License

This project is licensed under the MIT License.
