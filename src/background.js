'use strict';
var spawner = require('child_process').spawn;
let processing = false;
const port = chrome.runtime.connectNative("application");

chrome.runtime.onInstalled.addListener(() => {
  console.log("background.js installed!")

  chrome.contextMenus.create({
      id: "test",
      title: "This is a test",
      type: "normal",
      contexts: ["selection"]
  })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  port.onMessage.addListener((response) => {
    console.log("Received: " + response);
    sendResponse({ value: response });
    processing = false;
  });

  if (processing) return;
  console.log("hostname=");
  console.log(message)
  processing = true;
  port.postMessage(message);

  return true;
});

chrome.contextMenus.onClicked.addListener(function(info, tab){

  console.log("info: ")
  console.log(info.selectionText)

  const pythonProcess = spawner('python', ['C:/Users/surfy/Documents/Dissertation/Python Files/BERTopic/test.py', "hi 1"]);

  pythonProcess.stdout.on('data', (data) => {
      console.log('Data received from python: ', data.toString());
  })
})
