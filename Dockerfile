# Generated by https://smithery.ai. See: https://smithery.ai/docs/build/project-config
# Use official Node.js 18 LTS Alpine image
FROM node:lts-alpine AS builder
# Create app directory
WORKDIR /usr/src/app
# Install dependencies without running prepare scripts
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src
RUN npm install --ignore-scripts && npm run build

# Runtime stage
FROM node:lts-alpine
WORKDIR /usr/src/app
# Copy built files and dependencies
COPY --from=builder /usr/src/app/build ./build
COPY package.json package-lock.json ./
RUN npm install --production --ignore-scripts

# Set entrypoint
ENTRYPOINT ["node", "build/index.js"]
