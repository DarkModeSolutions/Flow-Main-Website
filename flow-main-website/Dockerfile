# Use an official lightweight Node.js image
FROM node:22-bookworm-slim

# Set the working directory
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the full source code
COPY . .

# ✅ Generate Prisma Client before building the app
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
