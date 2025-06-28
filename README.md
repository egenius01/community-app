# Community App

A full-stack community platform built with Django REST Framework backend and React frontend, enabling users to create groups, share posts, and connect with like-minded individuals.

## 🛠️ Technologies Used

### Backend
- **Django 4.2+** - Web framework
- **Django REST Framework** - API framework
- **JWT (JSON Web Tokens)** - Authentication
- **MySQL** - Database
- **django-cors-headers** - CORS handling
- **python-decouple** - Environment management

### Frontend
- **React 18+** - Frontend framework
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **React Context API** - State management

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd community-app/backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the `backend` directory:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOST=localhost,127.0.0.1
   DB_NAME=community_app
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=3306
   ```

5. **Create MySQL database**
   ```sql
   CREATE DATABASE community_app;
   ```

6. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start the backend server**
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## 📋 Known Limitations & Assumptions

### Backend Limitations
- **Database**: Currently configured for MySQL only. PostgreSQL or SQLite support would require additional configuration.
- **Authentication**: JWT tokens are stored in localStorage (not recommended for production).
- **File Uploads**: No file upload functionality implemented.
- **Real-time Features**: No WebSocket support for real-time updates.
- **Caching**: No caching layer implemented.
- **Rate Limiting**: No API rate limiting configured.

### Frontend Limitations
- **Browser Support**: Optimized for modern browsers (Chrome, Firefox, Safari, Edge).
- **Mobile Responsiveness**: Basic responsive design implemented.
- **Offline Support**: No offline functionality or service workers.
- **Progressive Web App**: Not configured as a PWA.
- **Internationalization**: No multi-language support.

### Security Assumptions
- **HTTPS**: Assumes HTTPS in production (not configured for development).
- **CORS**: Configured for development environment only.
- **Environment Variables**: Assumes proper environment variable management in production.
- **Database Security**: Assumes secure database configuration in production.

### Functional Assumptions
- **User Permissions**: Users can only post in groups they created.
- **Data Validation**: Relies on Django's built-in validation.
- **Error Handling**: Basic error handling implemented.
- **User Experience**: Assumes users have basic web browsing skills.

### Development Assumptions
- **Development Environment**: Configured for local development.
- **Database**: Assumes local MySQL instance.
- **Ports**: Backend runs on port 8000, frontend on port 3000.
- **Dependencies**: All dependencies listed in requirements.txt and package.json.

## 🔧 Quick Start Commands

### Backend
```bash
cd backend
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
