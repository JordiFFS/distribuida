FROM node:18-alpine

WORKDIR /app

COPY ./vanilla-app/package*.json ./
RUN npm install

COPY ./vanilla-app ./

RUN mkdir -p /app/backend/db/data

EXPOSE 4000

CMD ["npm", "start"]
