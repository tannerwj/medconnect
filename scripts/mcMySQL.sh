#!/bin/bash
MY_PROMPT='Enter a password for the MySQL user MedConnect: '
echo -n "$MY_PROMPT"
read userPassword

ROOT_PROMPT='Enter the MySQL root user password (for table creation), if MySQL is not installed this will be the root password: '
echo -n "$ROOT_PROMPT"
read rootPassword

#DEBIAN_FRONTEND=noninteractive sudo apt-get -y install mysql-server Future functionality will be to install mySQL as well.
#mysqladmin -u root password "$rootPassword"
#sudo /etc/init.d/mysql restart

MYSQL_COMMAND="CREATE DATABASE medconnect; GRANT ALL PRIVILEGES ON medconnect.* TO 'MedConnect'@'localhost' IDENTIFIED BY '$userPassword'; USE medconnect; source ./config/schema.sql; exit"

mysql --user="root" --password="$rootPassword" --execute="$MYSQL_COMMAND"

#This creates the ENV files with the newly created credentials.
echo "DB_HOST=localhost" > .env
echo "DB_USER=MedConnect" >> .env
echo "DB_PASSWORD=$userPassword" >> .env
