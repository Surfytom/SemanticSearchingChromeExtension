'use strict';

import './popup.css';

const hbutton = document.getElementById('helpButton');

const numberInput = document.getElementById('number-input');
const textInput = document.getElementById('text-input');

hbutton.addEventListener('click', (event) => {
  console.log('clicked help button');
  console.log(event);

  window.open("help.html")
});

numberInput.addEventListener('change', async (event) => {
    console.log('input for return paper amount: ', event.target.value);

    const response = await chrome.runtime.sendMessage({head: "amount", value: event.target.value});
    // do something with response here, not outside the function
    console.log(response);
    if(response.result){
        console.log("success")
        numberInput.placeholder = "successfully changed amount";
    } else {
        console.log("Error")
    }
});
textInput.addEventListener('change', async (event) => {
  console.log('input for folder rename: ', event.target.value);

  const response = await chrome.runtime.sendMessage({head: "folderRename", value: event.target.value});
  // do something with response here, not outside the function
  console.log(response);
  if(response.result){
      console.log("success")
      textInput.placeholder = "successfully changed folder name";
  } else {
      console.log("Error")
  }
});
