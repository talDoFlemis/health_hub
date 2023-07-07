# syntax=docker/dockerfile:experimental
FROM eclipse-temurin:17-jdk-jammy as build
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN --mount=type=cache,target=/root/.m2 ./mvnw install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

FROM eclipse-temurin:17-jre-jammy as runner
VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

RUN mkdir -p src/main/resources
COPY src/main/resources/*.csv src/main/resources/

RUN echo "spring.datasource.url=\${SPRING_DATASOURCE_URL}" >> application.properties && \
    echo "spring.datasource.username=\${SPRING_DATASOURCE_USERNAME}" >> application.properties && \
    echo "spring.datasource.password=\${SPRING_DATASOURCE_PASSWORD}" >> application.properties && \
    echo "spring.jpa.show-sql=false" >> application.properties && \
    echo "spring.jpa.properties.hibernate.format_sql=false" >> application.properties && \
    echo "spring.jpa.hibernate.ddl-auto=update" >> application.properties

EXPOSE 7777
ENTRYPOINT ["java","-cp","app:app/lib/*","com.usguri.health_hub.HealthHubApplication"]
