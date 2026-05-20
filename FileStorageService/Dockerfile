FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

RUN mkdir -p uploads

COPY . .

EXPOSE 3002

CMD ["node", "server.js"]