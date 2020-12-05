FROM openjdk:8-alpine

COPY target/uberjar/agile-sliders.jar /agile-sliders/app.jar

EXPOSE 3000

CMD ["java", "-jar", "/agile-sliders/app.jar"]
