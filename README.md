# Undergraduate Dissertation

This repository contains my undergraduate dissertation project. It is a chrome extension that allows a user to highlight some text on a webpage and recieve related research papers based on that text. It uses a vector based database ([Weaviate](https://weaviate.io/)). This database generates vectors to store in itself by running text through an embedding model (the encoder half of a tranformer model) then storing the resulting vector. This database can then be queried by searching the vector space with an input vector to comapare with.

---
I will be using visual studio code as a IDE for all setups. Please translate steps to relevant methods when using alternative IDE's.

Setups for all sections of the repository assume you have already cloned the whole repository onto your local machine.

Table of Contents: 
 - [Chrome Extension](#chromeextension)
 - [Node Js Server](#nodejsserver)
 - [Weaviate Database using Docker](#weaviate)
 - [IPYNBFiles+PythonServer Files](#otherfiles)
---
### Chrome Extension <a name="chromeextension"></a>

Before attempting this setup make sure you these dependencies installed on your system:

- Chrome
- Node Js (I used version 16.16.0 for this project)

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

- [Node Js](https://nodejs.org/en) (I used version 16.16.0 for this project)

**Setup**

 1. Open an integrated terminal using the servers directory by right clicking the **"server"** folder and clicking **"open in integrated terminal"**
 2. Once opened type `npm install` to install all dependencies into the directory
 3. After he installation is finished run `npm run start` in the same terminal to start the server
 4. The terminal should output `Lisening on port: 3000`which means the server is running on this port
 5. The server will error when using it in conjunction with the extension if the Weaviate database is not runnning

---
### Weaviate Database using Docker <a name="weaviate"></a>

I recommend >10GB of RAM for this setup process. This is due to the docker images and the embedding model take up 6 - 10GB of RAM. From my experience the RAM usage never exceeds 10GB's.

Before attempting this setup make sure you these dependencies installed on your system:

- [Docker desktop application](https://docs.docker.com/desktop/install/windows-install/)

**Setup**

 1. Install a database from Google drive using [this link](https://drive.google.com/drive/folders/1Efu7RF4g2tpcanlMOzjkRB-EdVX8WUU0?usp=sharing) (1GB 100,000 object version | 3GB 700,000 object version) 
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
### IPYNBFiles+PythonServer Files <a name="otherfiles"></a>
All other files use python. They consist of the dataset manipulation code. The database insertion code as well as the initial python implementation of the web socket server.

All of these files use the same conda enviroment which is stored within the **" IPYNBFiles+PythonServer"** folder.

Before attempting this setup make sure you these dependencies installed on your system:

- [MiniConda](https://docs.conda.io/en/latest/miniconda.html#)

**Setup**

 1. Open up the **Anaconda prompt** terminal
 2. Type `conda env create -n ENVNAME --file PATHTOFILE/condaenv.yml` into the terminal making sure the full path file is correct and specifying a environment name
 3. Once this is installed we can open visual studio code and open the extensions menu
 4. Typing `ms-python.python` into the search bar will return the python extension. Install this extension and restart visual studio code if required

**For .py Files**

 1. There should be interpreter options in the bottom right of visual studio code when a python file is open
 2. The option we want should be labelled as **"Select Interpreter"** or have a similar syntax to `3.10.9 ('enviroment': conda)`
 3. Click this option and select the conda environment you created earlier
 4. Once selected click the down arrow button next to the run code button in the top right and select **"Run Python File"** (this only needs to be clicked once then it is default)

**For .ipynb Files**

 1. Install the Jupyter notebook extension using this extension code `ms-toolsai.jupyter`
 2. Once installed open a file and click **"Select Kernel"** in the top right
 3. Select the conda environment you created earlier
 4. You should now be able to run the blocks of code

---
