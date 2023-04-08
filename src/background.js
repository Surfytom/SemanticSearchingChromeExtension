'use strict';
var spawner = require('child_process').spawn;

chrome.runtime.onInstalled.addListener(() => {
  console.log("background.js installed!")

  chrome.contextMenus.create({
      id: "test",
      title: "This is a test",
      type: "normal",
      contexts: ["selection"]
  })
})

chrome.contextMenus.onClicked.addListener(function(info, tab){

  console.log("info: ")
  console.log(info.selectionText)

  const pythonProcess = spawner('python', ['C:/Users/surfy/Documents/Dissertation/Python Files/BERTopic/test.py', "hi 1"]);

  pythonProcess.stdout.on('data', (data) => {
      console.log('Data received from python: ', data.toString());
  })
})
