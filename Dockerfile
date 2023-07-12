FROM node:18 as builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM nginx:1.13
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/build /app/build
#CMD [ "nginx", "-g", "daemon off;" ]
