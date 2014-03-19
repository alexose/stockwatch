// Listen for DOM changes
document.addEventListener('DOMNodeInserted', function(){
    console.log('what');
});

chrome.extension.onRequest.addListener(function(request, sender, callback) {
  var tabId = request.tabId;
  chrome.tabs.executeScript(tabId, { file: "content.js" }, function() {
    chrome.tabs.sendRequest(tabId, {}, function(results) {
      load();
    });
  });
});
