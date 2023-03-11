# Sample Account and Cloud Access

We have created an account with sample data:

**Account name**: mongo@admin.com   
**Account password**: qwer   
**Admin Pin**: 123   

We also have deployed the project on AWS server:

**Frontend application**: [Click here](https://production.d3rtjtn92vn19k.amplifyapp.com/)   
**Backend server**: [Click here](https://d2ny6ajz2dvgp0.cloudfront.net)

# First time setup

We choose the Lubuntu 20.41 environment to test and run our project. The following steps are only for setup on Lubuntu 20.41, and only need to setup once.

## Step 0 Using one-stop shell script

We have prepared a shell file for you to do the first time setup on Lubuntu 20.41.
Please ensure you are in the project root folder, and you do not have node, npm, yarn, mongoDB on your system.
Issuing the following commands in the QTerminal:
```sh
> chmod +x initial_setup.sh
> ./initial_setup.sh
```
During the installation, you may need to enter the root password several times.

We highly recommend you to use Google Chrome for running our project in order to maximum your experience. To install Chrome, simply issuing the following commands on your QTerminal:

```sh
> cd ~
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo apt install ./google-chrome-stable_current_amd64.deb
```

After all the installation completed, you can skip the following steps and jump to Before Each Start Section.

## Step 1 Install tools:   
### **If you have done step 0, Please SKIP this and following steps and jump to Before Each Start Section.**   
Install npm and yarn package manager.
Firstly, open the QTerminal on Lubuntu 20.04 and enter the commands below
```sh
> sudo apt update
> sudo apt install -y curl
> curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
> sudo apt install -y nodejs
> sudo apt install npm
> sudo npm install --global yarn
> node -v
v16.18.1
```
After we have the node version number, we can run the following command to confirm the right tools have been installed correctly.

```sh
> yarn -v
1.22.19
> npm -v
8.5.1
```

## Step 2 Configure of Database server
### **If you have done step 0, Please SKIP this step and jump to Before Each Start Section.**   
We use MongoDB 6.0 Community Edition for our database. Please run the following commands to setup local database server on Lubuntu:
```sh
> wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
ok
```
If the response is not ok, and required gnupg, we can install the package and reimport the public key. 
```sh
> sudo apt-get install gnupg
> wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
```
After that, we need to create a list file for MongoDB:
```sh
> echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list    
```
Then, we reload the package database and install MongoDB:
```sh
> sudo apt-get update
> sudo apt-get install -y mongodb-org
```
We could start mongod process by issuing the following command:
```sh
> sudo systemctl start mongod
```
Verify that MongoDB has started:
```sh
> sudo systemctl status mongod
```
If the following lines appear under the command, the Mongo server has been running on localhost:
```sh
● mongod.service - MongoDB Database Server
     Loaded: loaded (/lib/systemd/system/mongod.service; disabled; vendor preset: enabled)
     Active: active (running) since Sun 2022-11-13 17:03:04 AEDT; 7s ago
       Docs: https://docs.mongodb.org/manual
   Main PID: 15785 (mongod)
     Memory: 63.2M
        CPU: 164ms
     CGroup: /system.slice/mongod.service
             └─15785 /usr/bin/mongod --config /etc/mongod.conf
```
After the database server is running, we could load the sample data into the database.
Please ensure you are in the project folder and there is a folder named dump under the project folder.
Now we could issue the following command in project folder:
```sh
> mongorestore --host 127.0.0.1 --port 27017
```

# Before each start

Every time when you need to run the project, you may need to do the following things.

## Step 1 Start the database server
Before we start the project, we need to check if the database server is running by issuing the following command:
```sh
> sudo systemctl status mongod
```
If the server is not running, we could start it by issuing the following command:
```sh
> sudo systemctl start mongod
```

## Step 2 Build backend server

Open the QTerminal in the project root folder, run the following command to go to backend folder:
```sh
> cd backend
```
We need to install the dependencies when first time running the server:
```sh
> yarn install
```
After all dependencies have been installed, we could run the command to start the server:
```sh
> yarn start
```
The server should be able to run on local server when you see the following information in the terminal.
```sh
------------------------------------------------
[nodemon] 2.0.19
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node app.js`
(node:56759) ExperimentalWarning: Importing JSON modules is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Example app listening on port 5001
------------------------------------------------
```  

## Step 3 Start frontend application

Then open another QTerminal in the project root folder, run the following command to go to backend folder:
```sh
> cd frontend
```
We need to install the dependencies when first time running the server:
```sh
> yarn install
```
After all dependencies have been installed, we could run the command to start the application:
```sh
> yarn start
```
Finally, if everything is working, you may see below information in the terminal.
```sh
------------------------------------------------
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000

Note that the development build is not optimized.
To create a production build, use yarn build.

webpack compiled successfully
------------------------------------------------
```
