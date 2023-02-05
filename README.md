# 👀 Welcome to wwiDEV API 👀

---
![Background](https://raw.githubusercontent.com/imLines/imLines/458bc5dcc37b7c99f673863f8c73675ce0f9ecc2/wwiDEV%20Logo%20black%20on%20white.svg)

---

This API has been developed to be accessed by web and mobile. It was developed respecting the MVC model.
This API is intended to work with [wwiDEV Frontend](https://github.com/imLines/wwi-dev-frontend)_ on a VPS.

&nbsp;

## 💻 Languages/framework/ORM using
>![JavaScript](https://img.icons8.com/color/48/null/javascript--v1.png) ![NodeJs](https://img.icons8.com/color/48/null/nodejs.png)  ![EpressJs](https://api.iconify.design/simple-icons/express.svg?width=48&height=48) ![Sequelize](https://api.iconify.design/vscode-icons/file-type-sequelize.svg?width=48&height=48) ![SQL](https://api.iconify.design/logos/mysql.svg?width=48&height=48)

JavaScript - NodeJs - ExpressJs - Sequelize - SQL

&nbsp;

## Features
- Management of error messages in the logs.
- Share posts on popular networks.
- Cache management to improve performance and save resources.
- Newsletter (possibility to subscribe, unsubscribe, receive all new posts and the link to access them. The email is sent in html form for better rendering).
- Ability to create, update and delete posts, as well as the corresponding category.
- Ability to create, update and delete categories.
- Ability to create, update and delete administrators (secure).
- Security middleware to verify the authenticity of access tokens.

## Upcoming Features
- Test with Jest for ease of integration.
- Possibility to create an account to write comments and leave a rating.


## Getting started
1.Install all dependencies

    npm install

2.Create '.env' file at root
    
    touch .env
    
3.Add all keys in '.env'

``` 
PROXY=

#MYSQL CONFIG
MYSQL_USERNAME=mysql.username
MYSQL_PASSWORD=mysql.password
MYSQL_HOST=mysql.host
MYSQL_DATABASE=mysql.DBname

#JSONWEBTOKEN
SECRET_KEY_TOKEN=secret
SECRET_KEY_CONFIRM_NEWSLETTER=secret

#FOR GMAIL SENDER API
EMAIL=gmail.email
PASSWORD_EMAIL=gmail.password
CLIENT_ID=gmail.clientID
CLIENT_SECRET=gmail.secret
REFRESH_TOKEN=gmail.tokenRefresh
PASS=gmail.passwordToken
```

4.Start project 

    npm run start
