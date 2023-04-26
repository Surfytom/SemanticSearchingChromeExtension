'use strict';

// Global variables
let connection;

let bookmarkParent;
let workingFolderId;
let sessionID = 0;
let workingFolderName;
let amountOfPapers;

chrome.runtime.onInstalled.addListener(() => {
  console.log("background.js installed!")

  // Connect to backend server to fetch db data
  connection = new WebSocket("ws://localhost:3000/")

  // If the socket connection errors console log with error message
  connection.onerror = (event) => {
    console.log("Socket Error. Check server is running on correct port and try again by refreshing the extension.")
  }

  // Add event listener to run when messages are received from the server
  connection.addEventListener("message", (event) => {

    // Parse incoming message into object
    let data = JSON.parse(event.data)
    console.log(data.response)

    // Creates session folder title
    let title = "Session " + sessionID

    // Adds session folder to root bookmark using global folder ID
    chrome.bookmarks.create({'parentId': workingFolderId, 'title': title}).then((folder) => {
      console.log("Created new folder for session called: " + folder.title)
      
      // Creates bookmark link in session folder for each link recieved by the server
      for (let i = 0; i < data.response.length; i++) {
        chrome.bookmarks.create({
          'parentId': folder.id,
          'title': data.response[i].title,
          'url': data.response[i].pdfId
        })
      }
      
      // Increments session ID counter
      sessionID++;

    })
  })

  // Tries to get saved variables for folder title and paper amount
  chrome.storage.sync.get(["amount", "title"]).then((e) => {
    console.log("amount variable from storage: " + e.amount)
    console.log("title variable from storage: " + e.title)

    // If title is not found assign default name otherwise assign stored name
    if(e.title != undefined){
      workingFolderName = e.title
    } else {
      workingFolderName = "Papers Found - Chrome Extension"
    }

    // If amount is not found assign default amount otherwise assign stored amount
    if(e.amount != undefined){
      amountOfPapers = e.amount
    } else {
      amountOfPapers = 5
    }

    // Get bookmark tree
    chrome.bookmarks.getTree().then((bookmarkTree) => {

      console.log(bookmarkTree[0].children[0])
      
      // Assign the bookmark bar to variable for easy access
      bookmarkParent = bookmarkTree[0].children[0]
  
      // Loops through children in bookmark bar and attempts to find folder with stored name
      let folderFound = false
      for (let i = 0; i < bookmarkParent.children.length; i++) {

        // If the folder is found assign workingFolderId to its id
        if (bookmarkParent.children[i].title == workingFolderName) {
          folderFound = true
          workingFolderId = bookmarkParent.children[i].id
          
          // Loop through the children within this found folder to find the highest session number
          for (let j = 0; j < bookmarkParent.children[i].children.length; j++){

            let sessionTitle = bookmarkParent.children[i].children[j].title
            let sessionNum = sessionTitle[(sessionTitle.length-1)]

            if(sessionID < sessionNum){
              // Assign sessionID to one higher than the highest session found
              sessionID = (parseInt(sessionNum) + 1)
            }
          }
        }
      }
      
      // If the folder isn't found create new one and assign session ID to 0 and workingFolderId to the new folder id
      if(!folderFound) {
        chrome.bookmarks.create({'parentId': bookmarkParent.id, 'title': workingFolderName}).then((folder) => {
          console.log("New folder created in bookmarks bar: " + folder.title)
          workingFolderId = folder.id
          sessionID = 0
        })
      }
    })
  })

  // Create right click context menu for text selection
  chrome.contextMenus.create({
      id: "scan",
      title: "Scan for related papers",
      type: "normal",
      contexts: ["selection"]
  })
});



chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
  // Recieves messages from popup.js decodes command and execute with given arguments

  console.log("Received: ", request);

  switch (request.head){
    case "amount":
      // If command is amount make sure the value is between 0 - 10

      if(request.value > 10){
        request.value = 10
      }
      if(request < 0){
        request.value = 1
      }
      
      // Set the parsed config value to storage and if succesful assign global variable to it and return success
      chrome.storage.sync.set({amount: request.value}).then(() => {
        console.log("New amount " + request.value + " saved to storage")
        amountOfPapers = request.value
        sendResponse({result: true})
      })

      break;
    case "folderRename":
      // If command is folder rename update the folder to new title with argument parsed then save that new title in chrome storage returning success

      chrome.bookmarks.update(workingFolderId, {title: request.value}).then(() => {
        workingFolderName = request.value
        console.log("folder renamed to " + request.value)
        
        chrome.storage.sync.set({title: request.value}).then((e) => {
          console.log("New title " + request.value + " saved to storage")
          sendResponse({result: true})
        })
      })

      break;
    default:
      // Fell into unknown command return false
      console.log("fell into default, Unknown command")
      sendResponse({result: false})
  }

  // This return true statement tell the listener on popup.js to keep listening for the sendResponse function
  return true;
});

chrome.contextMenus.onClicked.addListener(function(info, tab){
  // When the custom context menu button is pressed take selected text and send to server with amount of papers variable

  console.log("Selected Text: ", info.selectionText)
  connection.send(JSON.stringify({body: info.selectionText, amount: amountOfPapers}))
});