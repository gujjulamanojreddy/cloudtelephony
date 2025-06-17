# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy full project
COPY . .

# Set Vite host to expose server to the network
ENV VITE_HOST=0.0.0.0

# Expose Vite's default dev server port
EXPOSE 5173

# Run the Vite development server
CMD [ "sh", "-c", "npm run dev -- --host 0.0.0.0" ]
