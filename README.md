# medconnect
[![Build Status](https://travis-ci.org/tannerwj/medconnect.svg?branch=master)](https://travis-ci.org/tannerwj/medconnect)
[![Dependency Status](https://gemnasium.com/tannerwj/medconnect.svg)](https://gemnasium.com/tannerwj/medconnect)

First, navigate to the project root folder and install all of the node dependencies

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
