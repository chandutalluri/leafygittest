FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/domains/identity-access/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY backend/domains/identity-access/ ./
COPY shared/ ./shared/

# Build the application
RUN npm run build

# Expose port
EXPOSE 3022

# Start the application
CMD ["npm", "run", "start:prod"]