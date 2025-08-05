FROM node:20-alpine AS build
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install --force
RUN npm install react-scripts@3.4.1 -g --silent
COPY . ./
COPY .env.zitro .env.production
RUN npm run build
# production environment
FROM nginx:1.20-alpine
ENV TZ=Asia/Tehran
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]