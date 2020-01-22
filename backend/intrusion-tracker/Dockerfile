FROM openjdk:11
COPY ./target/intrusion-tracker-0.0.1-SNAPSHOT.jar intrusion-tracker-0.0.1-SNAPSHOT.jar
ADD wait-for-it.sh /
RUN chmod u+x ./wait-for-it.sh
CMD ["./wait-for-it.sh","db:3306","--","java","-jar","intrusion-tracker-0.0.1-SNAPSHOT.jar"]
