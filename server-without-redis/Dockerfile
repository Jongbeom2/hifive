FROM node:12.13.0

WORKDIR /app

COPY . .

RUN yarn install

ENV PORT=4300

CMD ["sh","-c","node index.js"]