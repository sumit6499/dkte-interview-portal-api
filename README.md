
# Overview

The dkte-interview-portal-api is a backend API that powers an online interview portal. It provides functionality for managing candidate profiles and applications, scheduling and coordinating interviews, tracking interview progress and feedback, and integrating with other systems (e.g., HR, applicant tracking).




## Features

- Candidate profile and application management
- Interview scheduling and coordination
- Interview progress and feedback tracking
- Integration with external systems


## Documentation

[node.js](https://nodejs.org/en)

[Docker Docs](https://docs.docker.com/)

[AWS Docs](https://docs.aws.amazon.com/)

[Prisma](https://www.prisma.io/)




## Run Locally

Clone the project

#### npm

```bash
git clone https://github.com/sumit6499/dkte-interview-portal-api
```

Go to the project directory

```bash
  cd dkte-interview-portal-api
```

Install dependencies

```bash
   npm install
```

Configure the environment

- Create a .env file in the project root directory.
- Add the necessary environment variables (e.g., database connection, API keys).


build the typescript code

```bash
    npm run build
```

Start the server

```bash
    npm run start
```


#### pnpm

```bash
  git clone https://github.com/sumit6499/dkte-interview-portal-api
```

Go to the project directory

```bash
  cd dkte-interview-portal-api
```

Install dependencies

```bash
   pnpm install
```

Configure the environment

- Create a .env file in the project root directory.
- Add the necessary environment variables (e.g., database connection, API keys).

build the typescript code

```bash
    pnpm build
```

Start the server

```bash
    pnpm dev
```

## Installation


Docker Installation

[Docker Installation Link](https://docs.docker.com/desktop/install/windows-install/)

Run via docker

```bash
  docker compose up
```


    
## Documentation

[node.js](https://nodejs.org/en)

[Docker Docs](https://docs.docker.com/)

[AWS Docs](https://docs.aws.amazon.com/)

[Prisma](https://www.prisma.io/)




## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`= 'your_node_env'

`AWS_SECRET_ACCESS_KEY`='your_access_key'

`AWS_ACCESS_KEY_ID`='your_access_keyID'

`DATABASE_URL`='your_database_url'

`JWT_SECRET_KEY`='your_jwt_secret'

`AWS_BUCKET_NAME`='your_bucket_name'

`MAIL_USER_ID`='your_mail_userid'

`MAIL_USER_PASS`='your_mail_userpassword'

`REDIS_URL`='your_redis_url'
## Deployment

### Manual Deployment

- To deploy this project AWS EC2
    
    1. Update Ec2 tools and softwares
    ```bash
    sudo apt get update && sudo apt upgrade -y
    ```

    2. Installation of git
    ```bash
    sudo apt-get install git
    ```

    3. Clone project repository
     ```bash
    git clone https://github.com/sumit6499/dkte-interview-portal-api
    cd project
    ```

    4. Install python and pip
     ```bash
    sudo apt-get install node.js
    sudo apt-get install npm
    ```

    5. Install dependencies
     ```bash
    npm install  
    ```

    6. Build app
     ```bash
    npm run build
    ```

    7. Start server
     ```bash
    npm start
    ```
    
    8. Download and Install Nginx
     ```bash
    sudo apt-install nginx
    sudo vim /etc/nginx/sites-available/default
    go to server_name as domain name with www.domainname
    in location 
    proxy_pass http://localhost:port;
    proxy_http_version 1.1;
    proxy_set_header upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade

    sudo nginx -t
    sudo service nginx restart
    ```


    9. Install pm2
     ```bash
    sudo npm i -g pm2
    ```
    10. start ditached api server
     ```bash
    pm2 start index.js
    pm2 logs
    ```
    11. Setup ssl cert
     ```bash
    sudo apt install python3-certbot-nginx
    sudo certbot --nginx -d domain.com 
    ```
    12. Configure security group
    - attach inbound traffic to port 3000 for tcp
    - allow traffic to route from anywhere
    
