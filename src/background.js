'use strict';

var socket = io('http://localhost:3690');

chrome.runtime.onInstalled.addListener(() => {
  console.log("background.js installed!")

  console.log(client)

  chrome.contextMenus.create({
      id: "test",
      title: "This is a test",
      type: "normal",
      contexts: ["selection"]
  })
});

chrome.contextMenus.onClicked.addListener(function(info, tab){

  console.log("info: ")
  console.log(info.selectionText)

  console.log("client:", client.info)
});
