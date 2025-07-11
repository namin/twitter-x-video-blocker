document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const status = document.getElementById('status');
  
  function updateUI(enabled) {
    if (enabled) {
      toggleSwitch.classList.add('active');
      status.textContent = 'Videos are blocked';
      status.className = 'status enabled';
    } else {
      toggleSwitch.classList.remove('active');
      status.textContent = 'Videos are allowed';
      status.className = 'status disabled';
    }
  }
  
  chrome.storage.sync.get(['videoBlockingEnabled'], function(result) {
    const enabled = result.videoBlockingEnabled !== false;
    updateUI(enabled);
  });
  
  toggleSwitch.addEventListener('click', function() {
    const isCurrentlyEnabled = toggleSwitch.classList.contains('active');
    const newState = !isCurrentlyEnabled;
    
    chrome.storage.sync.set({videoBlockingEnabled: newState}, function() {
      updateUI(newState);
      
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && (tabs[0].url.includes('twitter.com') || tabs[0].url.includes('x.com'))) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'toggleVideoBlocking',
            enabled: newState
          });
        }
      });
    });
  });
});