# medconnect
[![Build Status](https://travis-ci.org/tannerwj/medconnect.svg?branch=master)](https://travis-ci.org/tannerwj/medconnect)
[![Dependency Status](https://gemnasium.com/tannerwj/medconnect.svg)](https://gemnasium.com/tannerwj/medconnect)


First, navigate to the project root folder.

Install NVM
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh
```

Installs the version of NVM that we want.
```
nvm install 4.4.5 
```

Specifies which version of NVM to be using.
```
nvm use 4.4.5
```

Maps default to 4.4.5
```
nvm alias default 4.4.5
```

Install all the Node modules required.
```bash
npm install
```

Then, set up your MySQL databases

```MySQL
create database medconnect;
use medconnect;
source /path/to/project/config/schema.sql
```

Then, edit your .env file with your database credentials

Afterwards, run the tests to make sure everything is correctly setup

```bash
npm test
```

Finally, start the server and in a browser navigate to your server on port 80

```bash
npm start
```
