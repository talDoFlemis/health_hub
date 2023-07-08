FROM maven:3.8.3-openjdk-17 AS build

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-jammy as runner
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

RUN mkdir -p src/main/resources
COPY src/main/resources/*.csv src/main/resources/

RUN echo "spring.datasource.url=\${SPRING_DATASOURCE_URL}" >> application.properties && \
    echo "spring.datasource.username=\${SPRING_DATASOURCE_USERNAME}" >> application.properties && \
    echo "spring.datasource.password=\${SPRING_DATASOURCE_PASSWORD}" >> application.properties && \
    echo "spring.jpa.show-sql=false" >> application.properties && \
    echo "spring.jpa.properties.hibernate.format_sql=false" >> application.properties && \
    echo "spring.jpa.hibernate.ddl-auto=update" >> application.properties

EXPOSE 7777
ENTRYPOINT ["java", "-jar", "app.jar"]
