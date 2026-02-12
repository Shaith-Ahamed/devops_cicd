version: "3.9"

services:
  frontend:
    build:
      context: ./frontend
      args:
        - VITE_API_BASE=http://${APP_PUBLIC_IP}:8081
    ports:
      - "3000:80"
    networks:
      - app-network
    restart: always

  backend:
    build: ./backend
    ports:
      - "8081:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://${RDS_ENDPOINT}/users?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
      SPRING_DATASOURCE_USERNAME: admin
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
    networks:
      - app-network
    restart: always

volumes:
  frontend_data:
  backend_data:

networks:
  app-network:
    driver: bridge
