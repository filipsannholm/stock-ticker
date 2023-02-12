FROM node:18-alpine as build

ARG SERVER_PORT=5000
ENV SERVER_PORT=${SERVER_PORT}

ARG REDIS_HOST=172.29.224.1
ENV REDIS_HOST=${REDIS_HOST}

ARG REDIS_PORT=6379
ENV REDIS_PORT=${REDIS_PORT}

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL $REACT_APP_BACKEND_URL

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci
COPY . ./
RUN npm run build

FROM nginx:latest

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build usr/src/app/build /usr/share/nginx/html

CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]