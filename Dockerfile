# Base image
FROM eclipse-temurin:21-jdk-jammy

# Copy jar file
COPY target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "/app.jar"]