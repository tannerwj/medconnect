#!/bin/bash
#current directory: medconnect-master

nvm install 4.4.5 #Installs the version of NVM that we want.

nvm use 4.4.5 #Specifies which version of NVM to be using.

nvm alias default 4.4.5 #Maps default to 4.4.5

npm install #Installs node packages required

npm test #Verifies that everything is setup correctly

node server.js #Starts the server and makes it accessible
