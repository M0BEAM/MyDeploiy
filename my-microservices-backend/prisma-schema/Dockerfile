# Dockerfile for NestJS
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy Prisma schema
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the app
COPY . .

# Start the application
CMD ["npm", "start"]
