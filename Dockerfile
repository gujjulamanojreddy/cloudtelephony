# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Set environment variable to ensure Vite listens on all interfaces
ENV VITE_HOST=0.0.0.0

# Expose Vite's default dev server port
EXPOSE 5173

# Start the Vite dev server and bind it to all network interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
