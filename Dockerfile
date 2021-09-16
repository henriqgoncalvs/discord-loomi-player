FROM node:alpine
WORKDIR /usr/discord-loomi-player
RUN apk add ffmpeg

COPY src/ src/
COPY package.json .
COPY .env .
RUN npm install

CMD ["npm", "start"]