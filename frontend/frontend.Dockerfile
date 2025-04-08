# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm i -g serve

# Copy the rest of the app's code to the container
COPY . .

# Build the React app
RUN npm run build

# Expose port 3000 to access the app
EXPOSE 8085

# Serve the app using a simple HTTP server
CMD [ "serve", "-s", "dist", "-l", "8085" ]
