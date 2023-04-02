FROM node:18
ARG configuration=production
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .
EXPOSE 8080
CMD [ "node", "index.js" ]