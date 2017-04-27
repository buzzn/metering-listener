FROM node:7.9 as build

WORKDIR /code
COPY package.json /code
RUN npm install --production
COPY index.js /code

FROM node:7.9-alpine

WORKDIR /code
COPY --from=build /code /code
CMD ["node", "index.js"]
