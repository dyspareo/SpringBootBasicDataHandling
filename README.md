<div align="center">

# 🎓 LearnIt — User Management System

**A full-stack CRUD application built with Spring Boot, React & MySQL**

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.8.7-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)

<br/>

> A clean, production-inspired CRUD web application that manages user records through a RESTful API backend and a React-powered frontend — all served from a single Spring Boot server.

<br/>

![LearnIt Banner](https://via.placeholder.com/900x300/2563eb/ffffff?text=LearnIt+User+Management)

</div>

---

## ✨ Features

- 📋 **View** all users in a clean, searchable list
- ➕ **Create** new user records with name, age, and email
- ✏️ **Edit & Update** existing users via inline form
- 🗑️ **Delete** users with a single click
- 🔍 **Search** by name, email, or ID in real time
- 💾 **Persistent storage** with MySQL database
- ⚡ **Single server** — React frontend served directly by Spring Boot

---

## 🗂️ Project Structure

```
firstapi_29APRIL/
├── src/
│   ├── main/
│   │   ├── java/org/example/
│   │   │   ├── Firstapi29AprilApplication.java   # Entry point
│   │   │   ├── User.java                         # Entity
│   │   │   ├── UserRepository.java               # JPA Repository
│   │   │   ├── UserService.java                  # Business logic
│   │   │   └── UserController.java               # REST endpoints
│   │   └── resources/
│   │       ├── static/
│   │       │   ├── index.html                    # Frontend entry
│   │       │   ├── app.js                        # React app (CDN)
│   │       │   └── styles.css                    # Styling
│   │       └── application.properties            # DB config
└── pom.xml
```

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | Fetch all users |
| `GET` | `/users/{id}` | Fetch user by ID |
| `POST` | `/users` | Create a new user |
| `PUT` | `/users/{id}` | Update an existing user |
| `DELETE` | `/users/{id}` | Delete a user |

### Sample Request — Create User

```json
POST /users
Content-Type: application/json

{
  "name": "Asha Raman",
  "age": 26,
  "email": "asha@example.com"
}
```

### Sample Response

```json
{
  "id": 1,
  "name": "Asha Raman",
  "age": 26,
  "email": "asha@example.com"
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2.5 |
| ORM | Spring Data JPA, Hibernate 6 |
| Database | MySQL 8.0 |
| Frontend | React 18 (CDN), Vanilla JS |
| Build Tool | Apache Maven 3.8.7 |
| Server | Embedded Apache Tomcat |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Java 17+
- Maven 3.8+
- MySQL 8.0+

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/learnit-user-management.git
cd learnit-user-management
```

### 2️⃣ Set Up MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create the database
CREATE DATABASE usersdb;
EXIT;
```

### 3️⃣ Configure application.properties

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/usersdb
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 4️⃣ Run the Application

```bash
mvn spring-boot:run
```

### 5️⃣ Open in Browser

```
http://localhost:8080
```

> Spring Boot serves both the API and the React frontend from the same port. No separate frontend server needed!

---

## 🎨 Frontend

The frontend is a React 18 app loaded via CDN (no Node.js required). It is placed inside `src/main/resources/static/` so Spring Boot serves it automatically.

**Key frontend features:**
- Real-time search filtering
- Edit mode with form pre-fill
- Status messages for every action
- Responsive layout for mobile and desktop

---

## 📚 What I Learned

- Building RESTful APIs with Spring Boot
- Connecting Spring Boot to MySQL using JPA/Hibernate
- Serving a React frontend from a Spring Boot static folder
- Fixing CORS issues by co-locating frontend and backend
- Implementing full CRUD with proper HTTP methods
- Debugging compilation errors and JPA `save()` vs `update()` behavior

---

## 🔮 Planned Improvements

- [ ] Input validation with `@Valid` and `@NotBlank`
- [ ] Global error handling with `@ExceptionHandler`
- [ ] Pagination and sorting for the user list
- [ ] Spring Security for authentication
- [ ] Unit tests with JUnit and Mockito
- [ ] Migrate frontend to React + Vite
- [ ] Deploy to Railway or Render

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ while learning Spring Boot

⭐ **Star this repo if it helped you!** ⭐

</div>
