'use strict';

let connection;
let bookmarkParent;
let workingFolderId;
let sessionID;
let workingFolderName;

chrome.runtime.onInstalled.addListener(async () => {
  console.log("background.js installed!")

  // Connect to backend server to fetch db data
  connection = new WebSocket("ws://localhost:3000/")

  // Add event listener to run when messages are received from the server
  connection.addEventListener("message", (event) => {
    let data = JSON.parse(event.data)
    console.log(data.response)

    chrome.bookmarks.getChildren(
      workingFolderId,
      function(result){
        console.log("Paper Folder Children:")
        console.log(result)
        sessionID = result.length

        let title = "Session " + sessionID

        chrome.bookmarks.create(
          {'parentId': workingFolderId, 'title': title},
          function(folder) {
            console.log("Created new folder for session called: " + folder.title)
            
            for (let i = 0; i < data.response.length; i++) {
              chrome.bookmarks.create({
                'parentId': folder.id,
                'title': data.response[i].title,
                'url': data.response[i].pdfId
              })
            }
          }
        )
      }
    )
  })

  let test = "hola"
  chrome.storage.sync.set({ test }).then(() => {
    console.log("Value is set to " + test);
  });

  chrome.storage.sync.get(["test"]).then((e) => {
    console.log("test outpout: " + e.test)
  })

  // Check a folder has been created for the paper bookmarks to store to if not create it
  chrome.bookmarks.getTree(
    function(bookmarkTree){

      console.log(bookmarkTree[0].children[0])

      bookmarkParent = bookmarkTree[0].children[0]

      let folderFound = false
      for (let i = 0; i < bookmarkParent.children.length; i++) {
        if (bookmarkParent.children[i].title == "Papers Found - Chrome Extension") {
          folderFound = true
          workingFolderId = bookmarkParent.children[i].id
        }
      }

      if(!folderFound) {
        chrome.bookmarks.create(
          {'parentId': bookmarkParent.id, 'title': "Papers Found - Chrome Extension"},
          function(folder) {
            console.log("New folder created in bookmarks bar: " + folder.title)
            workingFolderId = folder.id
            sessionID = 0
          }
        )
      }
    })

  chrome.contextMenus.create({
      id: "test",
      title: "Scan for related papers",
      type: "normal",
      contexts: ["selection"]
  })
});



chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  console.log("Received: ", request);

  switch (request.head){
    case "amount":
      console.log("amount to change to: " + request.value)
      
      sendResponse({result: true})
      break;
    case "folderRename":
      console.log("rename folder to: " + request.value)

      chrome.bookmarks.update(workingFolderId, {title: value})

      sendResponse({result: true})
      break;
    default:
      console.log("fell into default")
      sendResponse({result: false})
  }
});

chrome.contextMenus.onClicked.addListener(function(info, tab){

  console.log("info: ")
  console.log(info.selectionText)
  connection.send(JSON.stringify({body: info.selectionText}))
});