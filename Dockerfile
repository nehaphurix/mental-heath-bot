# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose a port (adjust according to your app)
EXPOSE 3000

# Start the app
CMD ["node", "main.js"]