# Video Blocker for Twitter/X

A Chrome extension that blocks all videos on Twitter/X with a simple toggle interface.

## Features

- 🚫 Blocks all videos on Twitter/X (x.com and twitter.com)
- 🔄 Easy toggle on/off via extension popup
- 💾 Remembers your preference across browser sessions
- ⚡ Works on dynamically loaded content
- 🎨 Clean, Twitter-style interface

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. The Video Blocker icon will appear in your toolbar

## Usage

1. **Automatic blocking**: Videos are blocked by default when you visit Twitter/X
2. **Toggle blocking**: Click the extension icon to enable/disable video blocking
3. **Visual feedback**: Blocked videos show a "Video blocked" message instead

## How It Works

When enabled, the extension:
- Hides all video elements on Twitter/X pages
- Replaces them with a "Video blocked" placeholder
- Continuously monitors for new videos as you scroll
- Maintains your preference across browser sessions

## Browser Support

- ✅ Chrome (recommended)
- ✅ Microsoft Edge
- ❌ Firefox (different manifest format required)

## Screenshots

The extension popup shows a simple toggle:
```
┌─────────────────────┐
│   Video Blocker     │
│   for Twitter/X     │
│                     │
│ Block Videos    [●] │
│                     │
│ Videos are blocked  │
└─────────────────────┘
```

Blocked videos appear as:
```
┌─────────────────────────────────┐
│              🚫                 │
│  Video blocked by Video Blocker │
│           extension             │
└─────────────────────────────────┘
```

## Privacy

This extension:
- ✅ Only runs on Twitter/X websites
- ✅ Stores preferences locally in your browser
- ✅ Does not collect or transmit any data
- ✅ Does not require account permissions

## Troubleshooting

**Videos still showing?**
- Try refreshing the page
- Check that the extension is enabled in `chrome://extensions/`
- Click the extension icon to verify blocking is turned on

**Extension not working?**
- Make sure you're on twitter.com or x.com
- Try disabling and re-enabling the extension
- Check browser console for errors

## Development

See [DEV.md](DEV.md) for technical documentation and development setup.

## License

MIT License - feel free to modify and distribute.
