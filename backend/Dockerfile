


FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

RUN apk update && apk add --no-cache bash netcat-openbsd maven

# Copy pom.xml and download dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the jar from build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]