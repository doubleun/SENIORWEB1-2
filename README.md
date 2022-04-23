# Setup local environtment
## 1. Setup workspace and development environment
1. Clone from branch you want
- master <- Stable release
- dev <- Unstable release (development environment)

2. Install dependencies
- In root directory (```./```) run ```npm i``` or ```npm install```
3. Ask the dev team for ```.env``` file
- Place ```.env``` file in the root directory (```./```) The final path should looks like this ```./.env```
4. Run dev server
- In root directory (```./```) run ```npm run dev```
5. Testing out the website
- Please make sure that you have a SQL database server running using Docker(recommended) or XAMPP. More info about setting up Docker down below.
- Go to http://localhost:3000

## 2. Running Docker (if you want to use XAMPP skip this part)
1. Install [docker](https://docs.docker.com/get-docker/) on your PC. For Windows you'll need to setup WSL2, please follow the instructions [here.](https://docs.docker.com/desktop/windows/install/)
2. Go to folder named "db" located in the root directory (```./db/```)
3. Run command ```docker-compose up -d```
4. Wait for docker to setup images
5. Go to http://localhost:8081 to check if phpMyAdmin shows up
6. Then, you can go back to the root directory (```./```) and run ```npm run dev``` and check out the website at http://localhost:3000

### NOTE:
- If you are using Docker, please make sure that the variables in the ```.env``` file are correct:
  - The database password should be: ```DB_PASS='root'```
  - And the port should be: ```DB_PORT=3308```

# Other
## Resourses:
- [Trello board](https://trello.com/b/ZDRtliDP/senior)

- [Project Doc (work in progress)](https://docs.google.com/document/u/1/d/1t9EwBr6hAleTO7v4ljuYS1nZ5FxNZsjD/edit?usp=sharing&ouid=112905365178969432939&rtpof=true&sd=true)

- [Videos Guide](https://drive.google.com/drive/u/1/folders/1cCRHNwGQ-3NyUzqnkJv0Jtjbab3UzaF7?fbclid=IwAR0GkJW4TFsKe55B-L_NNHiyEasURQOJPxnMO38L15shL7Q2Bxou3BleT3Q)

- [Test Result](https://docs.google.com/document/d/1YgUVU92XfDQD5lD_H-zSSyvBz2HhnjeOAJ6qB6IX4Mo/edit?fbclid=IwAR0BK5OkrcAgHlMcYuwz7LpEpQKrrODV5Qlhc73-s482l-ak3JHTyCFTIuk)

- [How to setup eslint and prettier](https://medium.com/@gogl.alex/how-to-properly-set-up-eslint-with-prettier-for-vue-or-nuxt-in-vscode-e42532099a9c)
