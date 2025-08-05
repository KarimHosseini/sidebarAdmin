FROM node:20-alpine
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH
COPY package.json ./

RUN npm install --force

# add app
COPY . ./








EXPOSE 3000

# start app
CMD ["npm", "start"]