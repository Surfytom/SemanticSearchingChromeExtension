# Dissertation
I will be using visual studio code as the default IDE for all setups. Please translate steps to relevant methods when using alternative IDE's.

Setups for all sections of the repository assume you have already cloned the whole repository onto your local machine.

Table of Contents: 
 - [Chrome Extension](#chromeextension)
 - [Node Js Server](#nodejsserver)
 - [Weaviate Database using Docker](#weaviate)
---
### Chrome Extension <a name="chromeextension"></a>

Before attempting this setup make sure you these dependencies installed on your system:

- Chrome
- Node Js

**Setup**

 1. Open an integrated terminal in the chrome extension directory by right-clicking the root folder of the extension called **"ChromeExtension"** and clicking **"open in integrated terminal"**
 2. Within this terminal type `npm install` to install all modules
 3. After step 3 is complete type `npm run build` into the integrated terminal to compile build files for the extension. A build folder should appear in the extension directory
 4. Go to **chrome://extensions/** to view all available extension on chrome
 5. Toggle developer mode in the top right so that it is on
 6. Now click **load unpacked** in the top left and select the build folder that was generated earlier
 7. A new extension should appear that is interact-able 
 8. Errors will appear if the server and database are not running when using the chrome extension
 9. If you need help using the extension's features please click the help button on the extension popup menu 

This extension was bootstrapped with [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli)

---
### Node Js Server <a name="nodejsserver"></a>

Before attempting this setup make sure you these dependencies installed on your system:

- Node Js

**Setup**

 1. Open an integrated terminal using the servers directory by right clicking the **"server"** folder and clicking **"open in integrated terminal"**
 2. Once opened type `npm install` to install all dependencies into the directory
 3. After he installation is finished run `npm run start` in the same terminal to start the server
 4. The terminal should output `Lisening on port: 3000`which means the server is running on this port
 5. The server will error when using it in conjunction with the extension if the Weaviate database is not runnning

---
### Weaviate Database using Docker <a name="weaviate"></a>

I recommend >8GB of RAM for this setup process. This is due to the docker images and the embedding model take up 4 - 6GB of RAM. From my experience the RAM usage never exceeds 8GB's.

Before attempting this setup make sure you these dependencies installed on your system:

- Docker desktop application

**Setup**

 1. Install a database from Google drive using this link (1GB 100,000 object version | 3GB 700,000 object version) 
 2. Open [this link](https://open.docker.com/extensions/marketplace?extensionId=docker/volumes-backup-extension) and install the extension that appears on your desktop docker app (skip to step 5 if this link works)
 3. If this link does not work open the docker desktop application and click **"Add Extension"** on the left menu
 4. You should see a search bar. Type **"volume"** into the search bar and install the extension called **"Volumes Backup & Share"**. It should have an icon with a blue background with a white drive
 5. Now open the newly installed extension and click **"Import into new volume"**  on the right hand side
 6. Now click **"select file"** and choose the zipped database file you downloaded from Google drive
 7. At the bottom you can select a volume name. THIS MUST BE CALLED **"dbData"** FOR THE DATABASE TO FUNCTION PROPERLY!
 8. Once the volume has been built you will be able to see it by clicking the **"Volumes"** section on the left menu
 9. Once the volume has build go to the repository and open an integrated terminal using the docker directory by right clicking the **"DatabaseDockerFolder"** folder and clicking **"open in integrated terminal"**
 11. Type `docker compose up` in the terminal to build the images for Docker to use to build the containers that will run the database. This will take around 10 minutes depending on your computer as the embedding model needs to be initialized.

---
