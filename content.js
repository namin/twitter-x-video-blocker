let isVideoBlockingEnabled = true;

function blockVideos() {
  if (!isVideoBlockingEnabled) return;
  
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    if (video.hasAttribute('data-video-blocked')) return;
    
    video.setAttribute('data-video-blocked', 'true');
    video.style.display = 'none !important';
    video.pause();
    video.currentTime = 0;
    video.removeAttribute('autoplay');
    video.muted = true;
    
    const container = findVideoContainer(video);
    
    if (container && !container.querySelector('.video-blocked-message')) {
      const blockedMessage = document.createElement('div');
      blockedMessage.className = 'video-blocked-message';
      blockedMessage.style.cssText = `
        background: #f7f9fa !important;
        border: 2px dashed #657786 !important;
        border-radius: 12px !important;
        padding: 20px !important;
        text-align: center !important;
        color: #657786 !important;
        font-size: 14px !important;
        margin: 10px 0 !important;
        min-height: 150px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-direction: column !important;
        position: relative !important;
        z-index: 1000 !important;
        width: 100% !important;
        box-sizing: border-box !important;
      `;
      blockedMessage.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 8px;">🚫</div>
        <div>Video blocked by Video Blocker extension</div>
      `;
      
      container.style.position = 'relative';
      container.appendChild(blockedMessage);
    }
  });
  
  const videoContainers = document.querySelectorAll('[data-testid="videoPlayer"], [data-testid="videoComponent"], .r-1d5kdc7');
  videoContainers.forEach(container => {
    if (container.querySelector('video') && !container.querySelector('.video-blocked-message')) {
      container.style.display = 'none';
    }
  });
}

function findVideoContainer(video) {
  let container = video.parentElement;
  let depth = 0;
  
  while (container && depth < 10) {
    if (container.hasAttribute('data-testid') || 
        container.className.includes('r-') ||
        container.tagName === 'ARTICLE' ||
        container.role === 'article') {
      return container;
    }
    container = container.parentElement;
    depth++;
  }
  
  return video.parentElement;
}

function unblockVideos() {
  const videos = document.querySelectorAll('video[data-video-blocked]');
  videos.forEach(video => {
    video.style.display = '';
    video.removeAttribute('data-video-blocked');
  });
  
  const blockedMessages = document.querySelectorAll('.video-blocked-message');
  blockedMessages.forEach(message => message.remove());
  
  const videoContainers = document.querySelectorAll('[data-testid="videoPlayer"], [data-testid="videoComponent"], .r-1d5kdc7');
  videoContainers.forEach(container => {
    container.style.display = '';
  });
}

function toggleVideoBlocking(enabled) {
  isVideoBlockingEnabled = enabled;
  if (enabled) {
    blockVideos();
  } else {
    unblockVideos();
  }
}

chrome.storage.sync.get(['videoBlockingEnabled'], (result) => {
  isVideoBlockingEnabled = result.videoBlockingEnabled !== false;
  if (isVideoBlockingEnabled) {
    blockVideos();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleVideoBlocking') {
    toggleVideoBlocking(request.enabled);
    sendResponse({success: true});
  }
});

const observer = new MutationObserver((mutations) => {
  if (isVideoBlockingEnabled) {
    let shouldCheck = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (let node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            if (node.tagName === 'VIDEO' || node.querySelector('video')) {
              shouldCheck = true;
              break;
            }
          }
        }
      }
    });
    
    if (shouldCheck) {
      setTimeout(blockVideos, 50);
    }
  }
});

function initializeExtension() {
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    blockVideos();
  } else {
    setTimeout(initializeExtension, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}

setInterval(() => {
  if (isVideoBlockingEnabled) {
    blockVideos();
  }
}, 2000);