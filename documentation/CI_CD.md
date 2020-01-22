# Intrusion Tracker

## CI/CD pipeline

### Dockerfiles

First we created 2 Dockerfiles, one for the spring boot web server and one for the React app:

- **React app:**
```DOCKERFILE
#Dockerfile.dev:

# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR ./

# add `//node_modules/.bin` to $PATH
ENV PATH ./node_modules/.bin:$PATH

COPY package.json ./package.json

#use the minified build file for production, not now - npm start is for development.
#COPY ./build/* ./public/ 

#install dependencies:
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g 

#copy your project files: (also bad for development, use volume(https://docs.docker.com/storage/volumes/) instead)
COPY . . 

# start 
CMD ["npm", "start"]
```

- **Spring boot web server**
```DOCKERFILE
FROM openjdk:11
COPY ./target/intrusion-tracker-0.0.1-SNAPSHOT.jar intrusion-tracker-0.0.1-SNAPSHOT.jar
CMD ["java","-jar","intrusion-tracker-0.0.1-SNAPSHOT.jar"]
```

### Docker compose

We created a Docker compose file that launches our mysql db, spring boot server and react app at the same time.

- **Docker compose:**
```DOCKERFILE
# Docker Compose file Reference (https://docs.docker.com/compose/compose-file/)

version: '3.7'

# Define services
services:
  # App backend service
  app-server:
    # Configuration for building the docker image for the backend service
    build:
      context: backend/intrusion-tracker # Use an image built from the specified dockerfile in the `polling-app-server` directory.
      dockerfile: Dockerfile
    ports:
      - "8080:8080" # Forward the exposed port 8080 on the container to port 8080 on the host machine
   
    depends_on: 
      - db # This service depends on mysql. Start that first.
    environment: # Pass environment variables to the service
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/intrusion_tracker
      SPRING_DATASOURCE_USERNAME: it
      SPRING_DATASOURCE_PASSWORD: intrusion-tracker2019    
    networks: # Networks to join (Services on the same network can communicate with each other using their name)
      - backend
      - frontend

  # Frontend Service 
  app-client:
    build:
      context: web-app # Use an image built from the specified dockerfile in the `polling-app-client` directory.
      dockerfile: Dockerfile
    ports:
      - "3000:3000" # Map the exposed port 80 on the container to port 9090 on the host machine
    depends_on:
      - app-server
    networks:
      - frontend  

  # Database Service (Mysql)
  db:
    image: mysql:5.7
    ports:
      - "3307:3306"
    environment:
      MYSQL_DATABASE: intrusion_tracker
      MYSQL_USER: it
      MYSQL_PASSWORD: intrusion-tracker2019
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - backend  
  
# Volumes
volumes:
  db-data:

# Networks to be created to facilitate communication between containers
networks:
  backend:
  frontend:  
```

### References

[Spring boot-mysql-react](https://www.callicoder.com/spring-boot-mysql-react-docker-compose-example/)

[Dockerizing react app](https://mherman.org/blog/dockerizing-a-react-app/ )