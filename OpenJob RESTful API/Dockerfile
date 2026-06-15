FROM node:20-alpine

WORKDIR /app

# install deps
COPY package*.json ./
RUN npm install

# copy source
COPY . .

EXPOSE ${PORT:-3000}

CMD ["npm","run","start:dev"]

