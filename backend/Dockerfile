# Use a lightweight Node.js image as the base
FROM node:alpine

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application to the container
COPY . .

# Expose the port your app runs on
EXPOSE 8800

# Command to run your application when the container starts
CMD ["node", "index.js"]
