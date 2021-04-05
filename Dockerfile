FROM node:14.16.0-alpine3.11

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

# TODO: Switch to production configuration
RUN yarn install

# Bundle app source
COPY . .

EXPOSE 3000
# stuff

# TODO: switch over to new yarn commands
CMD ["yarn", "start"]
