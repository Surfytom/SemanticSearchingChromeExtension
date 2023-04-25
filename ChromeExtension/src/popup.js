'use strict';

import './popup.css';

// Defining html elements from popup.html
const hbutton = document.getElementById('helpButton');

const numberInput = document.getElementById('number-input');
const textInput = document.getElementById('text-input');

hbutton.addEventListener('click', (event) => {
    // When help button is clicked open help.html file

    console.log('clicked help button opening help.html window');
    window.open("help.html")
});

numberInput.addEventListener('change', async (event) => {
    // When number input is changed (amount of papers config) send input value to background.js

    console.log('input for return paper amount: ', event.target.value);

    const response = await chrome.runtime.sendMessage({head: "amount", value: event.target.value});
    
    // Wait for response and display appropriate placeholder text depending on if errored or successful
    console.log(response);
    if(response.result){
        console.log("success")
        numberInput.placeholder = "successfully changed amount";
    } else {
        console.log("Error")
        numberInput.placeholder = "Error changing amount, try again";
    }
});

textInput.addEventListener('change', async (event) => {
    // When text input is changed (folder rename config) send inputed text to background.js

    console.log('input for folder rename: ', event.target.value);

    const response = await chrome.runtime.sendMessage({head: "folderRename", value: event.target.value});

    // Wait for response and display appropriate placeholder text depending on if errored or successful
    console.log(response);
    if(response.result){
        console.log("success")
        textInput.placeholder = "successfully changed folder name";
    } else {
        console.log("Error")
        textInput.placeholder = "Error renaming folder, try again";
    }
});
