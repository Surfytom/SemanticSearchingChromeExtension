'use strict';

var connection;
var bookmarkParent;
var workingFolderId;
var sessionID;

chrome.runtime.onInstalled.addListener(() => {
  console.log("background.js installed!")

  // Connect to backend server to fetch db data
  connection = new WebSocket("ws://localhost:7070/")

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



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Received: ", request);
});

chrome.contextMenus.onClicked.addListener(function(info, tab){

  console.log("info: ")
  console.log(info.selectionText)
  connection.send(JSON.stringify({body: info.selectionText}))
});
