yum update -y
amazon-linux-extras install docker
service docker start
nano Dockerfile

#Write the following into Dockerfile
FROM node:lts
WORKDIR /home/ec2-user/CompileIt
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node","index.js"]

nano .dockerignore
#Write following into .dockerignore file
node_modules
npm-debug.log

docker build -t mohitsoni98/CompileIt .
docker run -p 8080:8080 -d --restart unless-stopped mohitsoni98/compileit
