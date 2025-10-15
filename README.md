# Copy Enabler Extension

A browser extension that enables text selection and copying on websites that restrict it.

## Installation

### Chrome
1. Download or clone this repository
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the extension folder

### Firefox
1. Download or clone this repository
2. Go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file

## Features
- Enables text selection on restricted websites
- Removes copy/paste blocks
- Works on sites like HackerRank, Chegg, etc.

## Files
- `manifest.json` - Extension configuration
- `content.js` - Main script that enables copying
- `popup.html` - Extension popup UI
```

**7. Add .gitignore (optional but recommended)**
Create a `.gitignore` file:
```
.DS_Store
*.crx
*.pem
node_modules/