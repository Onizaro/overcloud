FROM node:20

WORKDIR /app/backend

COPY package*.json .
RUN npm install
COPY . .

EXPOSE 3000
CMD sleep 5 && npm start
