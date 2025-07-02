FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

COPY . .

RUN npm run build

# Remove dev dependencies for production
RUN npm prune --production

EXPOSE 3001

CMD ["npm", "start"] 