# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Start the Vite dev server with --host to allow external access
CMD ["npm", "run", "dev", "--", "--host"]
