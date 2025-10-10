# Use Node.js 18 Alpine (small image)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install --save-dev wait-port

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
