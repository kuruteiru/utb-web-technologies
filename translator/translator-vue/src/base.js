const { formatDiagnostic } = require("typescript");

// select the button using ID
const button = document.querySelector("#translateBtn");
const userInput = document.querySelector("#userInput");
const resultInput = document.querySelector("#result");
const loadingDiv = document.querySelector("#loading");


button.onclick = function () {
  // show the loading dialog
  loadingDiv.style.display = "block";
  // disable translate button

  button.setAttribute("disabled", "disabled");

  console.log(userInput.value);
  const inputText = userInput.value;

  // test - write into DOM
  resultInput.value = inputText;

  // REST API url endpoint
  const url = "https://api.mymemory.translated.net/get?q=" + inputText +
    "&langpair=cs|en";

  // create the GET request against API to obtain JSON result
  fetch(url)
    .then(function (response) {
      // server returns the response, parse it to JSON
      return response.json();
    })
    .then(function (myJson) {
      console.log(myJson);
      // get translation string from JSON, put it in result input
      resultInput.value = myJson.responseData.translatedText;

      // hide the loading dialog
      loadingDiv.style.display = "none";
      // enable translate button
      button.removeAttribute("disabled");
    });
};
