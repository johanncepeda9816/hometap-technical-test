![Project Banner](./assets/hometap-logo.svg)

# 🚀 Technical Test Hometap - Johann Cepeda

## 📋 Description

This project is a simple full-stack application built with Python using Django as the backend framework and React as the frontend library for creating intuitive and visually appealing user interfaces.

The main goal of the application is to display a table with results from two different providers. Each provider returns a JSON response with its own structure, so the application processes and normalizes the data into a unified format before delivering it to the frontend via an HTTP request.

The application exposes a single endpoint using the GET method to retrieve the processed data.

![Project Status](https://img.shields.io/badge/Status-%20Ready-green)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ Key Features

- ✅ Concurrent data fetching from multiple property data providers
- ✅ Intelligent 24-hour caching system for improved performance
- ✅ Advanced JSON data normalization with configurable mapping
- ✅ RESTful API with address-based property lookups
- ✅ Comprehensive logging for monitoring and debugging
- ✅ Thread-pooled execution with configurable timeouts
- ✅ Robust error handling and validation pipeline

## 🛠️ Technologies Used

### 🔹 Backend

- [Python](https://www.python.org/) - Main programming language
- [Django](https://www.djangoproject.com/) - Web framework
- [Django REST Framework](https://www.django-rest-framework.org/) - RESTful API
- [Redis](https://redis.io/) - In-memory data structure store used for caching
- [Poetry](https://python-poetry.org/) - Dependency management

### 🔹 Frontend

- [React](https://reactjs.org/) - JavaScript library
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Icon toolkit
- [React-Toastify](https://fkhadra.github.io/react-toastify/) - Toast notifications
- [Yarn](https://yarnpkg.com/) - Package manager

## 🎥 Demo

<div align="center">
<video width="600" controls>
    <source src="./assets/demo.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
</div>

## 🚀 Installation

### Prerequisites

- Python 3.9+
- Node.js 16+
- Redis (optional, for caching)

### Backend Setup

```bash
#Clone repository
This repository

# Install dependencies
cd backend
poetry install

# Activate virtual environment
poetry env activate

# Run server
python ./manage.py runserver
```

### Redis Setup (Optional)

Redis is used for caching property data to improve performance. If you don't want to use Redis, you can disable it.

#### Using Redis:

```bash
# Install Redis (Ubuntu/Debian)
sudo apt-get install redis-server

# Install Redis (macOS with Homebrew)
brew install redis

# Start Redis server
sudo service redis-server start  # Linux
brew services start redis        # macOS

# Verify Redis is running
redis-cli ping  # Should return PONG
```

#### Disabling Redis Cache:

If you don't want to use Redis, you can disable caching by setting

```bash
CACHE_ENABLED = False #in your settings file
```

### Frontend Setup

First, navigate to the frontend directory:

```bash
cd frontend
```

#### Using yarn (Recommended)

```bash
# Install dependencies
yarn install

# Start the development server
yarn dev
```

#### Using npm

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📝 API Documentation

The API documentation is available at `/api/docs/` when the server is running.

## 🧪 Testing

### Backend Tests

```bash
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [List any libraries, tutorials, or resources that you found helpful]
- [Give credit to anyone whose code was used]
- [Inspiration sources]

---

<div align="center">
  
  Made with ❤️ by [Your Name](https://github.com/username)
  
</div>
