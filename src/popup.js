'use strict';

import './popup.css';

const button = document.getElementById("optionsButton");

button.addEventListener('click', (event) => {
    console.log("clicked options button")
    console.log(event)
});
