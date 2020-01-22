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