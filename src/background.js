'use strict';

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

  // Add event listener to run when messages are received from the server
  connection.addEventListener("message", (event) => {

    let data = JSON.parse(event.data)
    console.log(data.response)

    chrome.bookmarks.getChildren(workingFolderId).then((result) => {
      console.log("Paper Folder Children:")
      console.log(result)

      let title = "Session " + sessionID

      chrome.bookmarks.create({'parentId': workingFolderId, 'title': title}).then((folder) => {
        console.log("Created new folder for session called: " + folder.title)
        
        for (let i = 0; i < data.response.length; i++) {
          chrome.bookmarks.create({
            'parentId': folder.id,
            'title': data.response[i].title,
            'url': data.response[i].pdfId
          })
        }
      })

      sessionID++;
    })
  })

  chrome.storage.sync.get(["amount", "title"]).then((e) => {
    console.log("amount variable from storage: " + e.amount)
    console.log("title variable from storage: " + e.title)

    if(e.title != undefined){
      workingFolderName = e.title
    } else {
      workingFolderName = "Papers Found - Chrome Extension"
    }

    if(e.amount != undefined){
      amountOfPapers = e.amount
    } else {
      amountOfPapers = 5
    }

    chrome.bookmarks.getTree().then((bookmarkTree) => {

      console.log(bookmarkTree[0].children[0])
  
      bookmarkParent = bookmarkTree[0].children[0]
  
      let folderFound = false
      for (let i = 0; i < bookmarkParent.children.length; i++) {
        if (bookmarkParent.children[i].title == workingFolderName) {
          folderFound = true
          workingFolderId = bookmarkParent.children[i].id
          
          for (let j = 0; j < bookmarkParent.children[i].children.length; j++){

            let sessionTitle = bookmarkParent.children[i].children[j].title
            let sessionNum = sessionTitle[(sessionTitle.length-1)]

            if(sessionID < sessionNum){
              sessionID = (parseInt(sessionNum) + 1)
            }
          }
        }
      }
  
      if(!folderFound) {
        chrome.bookmarks.create({'parentId': bookmarkParent.id, 'title': workingFolderName}).then((folder) => {
          console.log("New folder created in bookmarks bar: " + folder.title)
          workingFolderId = folder.id
          sessionID = 0
        })
      }
    })
  })

  chrome.contextMenus.create({
      id: "test",
      title: "Scan for related papers",
      type: "normal",
      contexts: ["selection"]
  })
});



chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
  console.log("Received: ", request);

  switch (request.head){
    case "amount":

      if(request.value > 10){
        request.value = 10
      }
      if(request < 0){
        request.value = 1
      }
      
      chrome.storage.sync.set({amount: request.value}).then(() => {
        console.log("New amount " + request.value + " saved to storage")
        amountOfPapers = request.value
        sendResponse({result: true})
      })

      break;
    case "folderRename":

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
      console.log("fell into default")
      sendResponse({result: false})
  }

  return true;
});

chrome.contextMenus.onClicked.addListener(function(info, tab){

  console.log("info: ")
  console.log(info.selectionText)
  connection.send(JSON.stringify({body: info.selectionText, amount: amountOfPapers}))
});