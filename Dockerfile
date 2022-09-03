FROM  node:latest
WORKDIR /

RUN npm install -g npm

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci --legacy-peer-deps
COPY . .
EXPOSE 3000

CMD ["npm", "run", "dev"]