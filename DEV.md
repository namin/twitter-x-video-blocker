# Video Blocker for X - Developer Documentation

## Overview

A Chrome extension that blocks all videos on Twitter/X (x.com and twitter.com) with a toggle interface. When activated, videos are hidden and replaced with a "Video blocked" message.

## Architecture

### Files Structure

```
fx/
├── manifest.json       # Extension configuration
├── content.js         # Main content script
├── styles.css         # CSS injection for video blocking
├── popup.html         # Extension popup interface
├── popup.js          # Popup logic and controls
├── icon16.png        # 16x16 extension icon
├── icon48.png        # 48x48 extension icon
├── icon128.png       # 128x128 extension icon
└── DEV.md           # This documentation
```

## Core Components

### 1. Manifest (manifest.json)

- **Manifest Version**: 3 (latest Chrome extension format)
- **Permissions**: `storage`, `activeTab`
- **Host Permissions**: `https://twitter.com/*`, `https://x.com/*`
- **Content Script**: Injected on document_start for early blocking
- **CSS Injection**: Styles injected alongside JavaScript

### 2. Content Script (content.js)

The main blocking logic runs in the context of Twitter/X pages.

#### Key Functions:

- **`blockVideos()`**: Core blocking function
  - Finds all `<video>` elements
  - Adds `data-video-blocked` attribute to track blocked videos
  - Applies `display: none !important` styling
  - Pauses videos and resets playback
  - Creates replacement "Video blocked" message
  - Hides video containers using data-testid selectors

- **`findVideoContainer(video)`**: Smart container detection
  - Traverses up DOM tree to find appropriate container
  - Looks for Twitter-specific attributes and classes
  - Falls back to direct parent if no suitable container found

- **`unblockVideos()`**: Removes all blocking
  - Restores video visibility
  - Removes blocked messages
  - Cleans up tracking attributes

#### Blocking Strategy:

1. **CSS Injection**: Immediate hiding via stylesheet
2. **JavaScript Blocking**: Comprehensive video manipulation
3. **Mutation Observer**: Watches for new videos being added
4. **Periodic Scanning**: 2-second interval backup check
5. **Container Hiding**: Hides entire video player components

#### Performance Optimizations:

- Uses `data-video-blocked` to avoid re-processing same videos
- Debounced mutation observer (50ms delay)
- Targeted DOM queries using Twitter-specific selectors
- Early document_start injection

### 3. User Interface

#### Popup (popup.html + popup.js)

- Clean toggle interface with Twitter-style design
- Real-time status display (enabled/disabled)
- Persistent settings via Chrome storage API
- Immediate toggle response with visual feedback

#### Storage Management

- Uses `chrome.storage.sync` for cross-device synchronization
- Default state: enabled (`videoBlockingEnabled !== false`)
- Communicates state changes to content script via messaging

### 4. Styling (styles.css)

CSS rules injected into Twitter/X pages:

```css
video[data-video-blocked] {
    display: none !important;
    /* Additional hiding properties */
}

[data-testid="videoPlayer"] video,
[data-testid="videoComponent"] video {
    display: none !important;
}
```

## Technical Implementation Details

### Video Detection

The extension targets multiple video contexts on Twitter/X:

1. **Direct video elements**: All `<video>` tags
2. **Video containers**: Elements with `data-testid="videoPlayer"` or `data-testid="videoComponent"`
3. **CSS classes**: Twitter's generated classes (e.g., `.r-1d5kdc7`)

### Blocking Mechanisms

1. **CSS-based**: Immediate hiding via injected stylesheet
2. **JavaScript-based**: Programmatic hiding with `!important` styles
3. **Attribute-based**: Video manipulation (pause, mute, reset)
4. **Container-based**: Hiding entire video player components

### Persistence & State

- Extension state persists across browser sessions
- Settings sync across devices (Chrome sync enabled)
- Content script receives initial state on page load
- Real-time toggle communication via Chrome messaging API

### Error Handling

- Graceful fallbacks for container detection
- Safe DOM traversal with depth limits
- Null checks for all DOM operations
- Non-blocking initialization with retry logic

## Browser Compatibility

- **Chrome**: Full support (Manifest V3)
- **Edge**: Compatible (Chromium-based)
- **Firefox**: Requires manifest conversion to V2

## Development Setup

1. Clone/download the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory
5. Extension will appear in toolbar

### Testing

- Visit twitter.com or x.com
- Verify videos are blocked and show replacement messages
- Test toggle functionality via extension popup
- Check that settings persist across page reloads

### Debugging

- Use Chrome DevTools on Twitter/X pages
- Check Console for any extension errors
- Inspect blocked video elements for `data-video-blocked` attribute
- Verify CSS injection in Elements tab

## Known Limitations

1. **Twitter Updates**: May require updates if Twitter changes their video implementation
2. **Performance**: Continuous monitoring has minimal but measurable CPU impact
3. **Ad Videos**: Some promotional video content might use different selectors
4. **Embedded Content**: Third-party embedded videos might not be caught

## Future Enhancements

- Whitelist specific accounts or content types
- Statistics tracking (videos blocked count)
- Keyboard shortcut for quick toggle
- Options page for advanced settings
- Support for other social media platforms