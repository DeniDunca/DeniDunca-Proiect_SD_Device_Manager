FROM openjdk:18
EXPOSE 8080
ADD target/ds-2020-0.0.1-SNAPSHOT.jar spring-docker.jar
ENTRYPOINT ["java","-jar","spring-docker.jar"]
