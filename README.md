# Setup local environtment
## 1. Setup workspace and development environment
1. Clone from branch you want
- master <- Stable release
- dev <- Unstable release, meant for testing environment
- senior2 <- Highly unstable
2. Install dependencies
- Go to ```./work/``` and run ```npm i``` or ```npm install```
3. Ask the dev team for ```.env``` file
- Go to ```./work/``` and put the ```.env``` file there, final path should looks like this ```./work/.env```
4. Run dev server
- Go to ```./work/``` and run ```npm run dev```
5. Testing out the website
- Go to http://localhost:3000

## 2. Running docker (if you want to use XAMPP skip this part)

1. Install [docker](https://www.docker.com/) on your PC
2. Go to ```./work/db/```
3. Run ```docker-compose up -d```
4. Wait for docker to setup images
5. Go to http://localhost:8081 to check if phpMyAdmin shows up

### NOTE:
- You have to change database password in ```.env``` file to ```DB_PASS='root'```
- Also the port to ```DB_PORT=3308```
