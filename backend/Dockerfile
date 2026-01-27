


FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

RUN apk update && apk add --no-cache bash netcat-openbsd

# Copy the local Maven repository with all dependencies
# COPY .m2/repository /root/.m2/repository

# Copy initial files
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw

COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

# Copy all backend code
COPY . .

# Fix permissions
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["./wait-for-it.sh", "db:3306", "--", "sh", "-c", "java -jar target/*.jar"]