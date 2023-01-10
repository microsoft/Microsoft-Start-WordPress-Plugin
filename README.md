# Microsoft Open Source Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

Resources:

- [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/)
- [Microsoft Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/)
- Contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with questions or concerns

# Introduction
WordPress Plugin for MSN.

It is based on WordPress latest version which is v5.8.*.

Tested up to WordPress 5.8.1.

This allows posts from WP to be pushed to MSN for ingestion and has a dashboard to show users their publishing statistics.

# VS Code Plugins
* PHP Debugger (Felix Becker)

# Dependencies
* Docker desktop
* WSL2 (or linux based host machine)
* Node 14 (or higher)
# Getting Started
Project is designed to be run in docker via WSL2, although other methods may also work.

1.	Ensure you have docker desktop and WSL2 installed/enabled
2.	Install npm dependencies

    `npm install`

3. Start the php debugger (runs on port 9000 on windows machine so that the docker image can connect), either by pushing f5 or the play button in the debug tab in vs code

4. Start the docker machine, install the php composer dependencies.

    `npm run install`

5.  Because we're running a slightly older version of wordpress for compatibility testing we need to alter mysql auth

    `npm run docker-db`

    `mysql --password=somewordpress mypasswordforwordpress`

    `ALTER USER wordpress IDENTIFIED WITH mysql_native_password BY 'mypasswordforwordpress';`

    `quit`

    `exit`

6.  start the webpack watch script to build the react code.  This uses nodemon so will restart when the webpack or packages config changes. you can also type `rs` to restart it.

    `npm run start`

7.  You should have a wordpress instance up on http://localhost:8000/wp-admin/, you will need to:

    * run through the install wizard
    * activate the microsoft news plugin


Note:  if you visit the plugin dashboard and the widgets are too wide then the `.container` class wasn't generated correctly, this is a known issue and sometimes you need to restart `npm run start` to address this.

# Build Plugin
A wordpress plugin is essentially whatever is in the /wp-content/plugins/microsoft-news/ zipped up for distribution.

We setup a docker based build at our end that creates a full dev environment as it was the easiest way to get composer (php package manager) working, and allowed us to easily setup new dev/test environments.  We then exteded it to zip up the plugin directory then upload it to DevOps as an artifact of an installable build.

# Useful Package.json commands

* install - setup docker and run php:install
* install:php - install php composer dependencies
* start - run webpack in watch mode
* docker-db - open bash terminal on mysql box
* docker-wp - open bash terminal on wp box
* generate-pot- generate language POT file based on plugin strings
* generate-languages - convert PO file to json files for frontend
