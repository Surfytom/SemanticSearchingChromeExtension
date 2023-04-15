'use strict';

let connection;

chrome.runtime.onInstalled.addListener(() => {
  console.log("background.js installed!")

  // Connect to backend server to fetch db data
  connection = new WebSocket("ws://localhost:7070/")

  // Add event listener to run when messages are received from the server
  connection.addEventListener("message", (event) => {
    console.log(event.data)
  })

  // Check a folder has been created for the paper bookmarks to store to if not create it
  chrome.bookmarks.getTree(
    function(bookmarkTree){

      console.log(bookmarkTree[0].children[0])

      let bookmarkBar = bookmarkTree[0].children[0]

      let folderFound = false
      for (let child in bookmarkBar.children) {
        if (child.title == "Papers Found - Chrome Extension") {
          folderFound = true
        }
      }

      if(!folderFound) {
        chrome.bookmarks.create(
          {'parentId': bookmarkBar.id, 'title': "Papers Found - Chrome Extension"},
          function(folder) {
            console.log("New folder created on bookmarks bar: " + folder.title)
          }
        )
      }
    })

  chrome.contextMenus.create({
      id: "test",
      title: "This is a test",
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
