FROM node:20

WORKDIR /usr/src

COPY package*.json ./

RUN npm install -g npm@11.0.0 && \
    npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start"]
