#!/bin/bash
MY_PROMPT='Enter a password for the MySQL user MedConnect: '
echo -n "$MY_PROMPT"
read userPassword

ROOT_PROMPT='Enter the MySQL root user password (for table creation): '
echo -n "$ROOT_PROMPT"
read rootPassword

mkdir ~/medconnect #This folder allows medconnect to be self-contained.

cd ~/medconnect #Navigates to the newly created directory.

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash #This gets the NVM installation script from github, not sure how stable may need to make a stable repo for our own purposes.

wget https://github.com/tannerwj/medconnect/archive/master.zip #Grabs from the master repo

unzip master.zip #Unzips newly created file

cd medconnect-master

gnome-terminal -e "bash -c \"./scripts/mcMySQL.sh; ./scripts/nvmDeploy.sh\""
