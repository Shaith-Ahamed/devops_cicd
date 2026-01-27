# Backend - Online Education Platform

Spring Boot backend application for the online education platform.

## Technologies

- **Java 17**
- **Spring Boot 3.5.4**
- **Spring Data JPA**
- **MySQL 8.3.0**
- **Maven** (Build tool)

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/learn/demo/    # Application source code
│   │   └── resources/
│   │       └── application.properties
│   └── test/                        # Test files
├── pom.xml                          # Maven dependencies
├── Dockerfile                       # Docker configuration
└── wait-for-it.sh                   # Database connection wait script
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Docker & Docker Compose (optional)

## Configuration

### Database Configuration

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3300/users
spring.datasource.username=root
spring.datasource.password=9133
```

For Docker deployment, the application uses environment-specific settings.

## Running Locally

### Using Maven

```bash
# Install dependencies and build
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

### Using Docker

```bash
# Build the Docker image
docker build -t online-education-backend .

# Run with Docker Compose (from project root)
docker-compose up backend
```

## Building

```bash
# Build without tests
./mvnw clean package -DskipTests

# Build with tests
./mvnw clean package
```

The compiled JAR will be in `target/` directory.

## Testing

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserRestControllerTest
```

Test reports are generated in `target/surefire-reports/`

## API Endpoints

The backend provides RESTful APIs for:
- User authentication and management
- Course management
- Dashboard services

API base URL: `http://localhost:8080/api`

## Docker Deployment

The Dockerfile uses:
- Base image: `eclipse-temurin:17-jdk-alpine`
- Wait script for database readiness
- Exposed port: `8080`

The application waits for MySQL (`db:3306`) before starting.

## Development

### IDE Setup

Import as a Maven project in your IDE (IntelliJ IDEA, Eclipse, VS Code).

### Hot Reload

Spring Boot DevTools is included for automatic restart during development:

```bash
./mvnw spring-boot:run
```

## Environment Variables

When running in Docker:
- Database connection details are configured via `application.properties`
- Adjust for production environments as needed

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running on the configured port
- Verify credentials in `application.properties`
- Check firewall settings

### Build Failures
- Verify Java 17 is installed: `java -version`
- Clean Maven cache: `./mvnw clean`
- Check Maven version: `./mvnw -version`

## CI/CD

This project includes Jenkins pipeline configuration (`Jenkinsfile` in project root) for automated building and testing.

## License

See project root for license information.
