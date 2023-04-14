'use strict';

let connection;

chrome.runtime.onInstalled.addListener(() => {
  console.log("background.js installed!")

  connection = new WebSocket("ws://localhost:8080/")

  //connection.send("hello")

  connection.addEventListener("message", (event) => {
    console.log(event.data)
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
  connection.send("hello")
});
