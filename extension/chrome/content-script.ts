import Browser from "webextension-polyfill";

// Listen for messages from the web dashboard
window.chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "requestData") {
    // Do something with the data received from the web dashboard

    // Send a response back to the web dashboard
    chrome.runtime.sendMessage({
      type: "responseData",
      data: {
        someValue: "Hello from the extension!",
      },
    });
  }
});
