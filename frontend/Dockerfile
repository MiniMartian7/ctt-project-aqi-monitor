# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Define environment variable
ENV REACT_APP_BACKEND_URL http://localhost:8800

# Run the application
CMD ["npm", "start"]
