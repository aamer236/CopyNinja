// Enable text selection by removing CSS restrictions
(function() {
  'use strict';

  // Remove user-select restrictions via CSS
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
    }
  `;
  
  // Add style as early as possible
  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.head.appendChild(style);
    });
  }

  // Function to enable all copy/cut/paste events
  function enableCopyEvents(e) {
    e.stopPropagation();
    return true;
  }

  // Remove event listeners that block copying
  const events = ['copy', 'cut', 'paste', 'contextmenu', 'selectstart'];
  
  events.forEach(event => {
    document.addEventListener(event, enableCopyEvents, true);
  });

  // Override any inline event handlers
  function removeInlineHandlers() {
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      events.forEach(event => {
        el[`on${event}`] = null;
      });
    });
  }

  // Run immediately and on DOM changes
  removeInlineHandlers();
  
  // Use MutationObserver to handle dynamically added elements
  const observer = new MutationObserver(() => {
    removeInlineHandlers();
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  // Override document methods that might block selection
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (events.includes(type)) {
      return; // Don't add copy-blocking listeners
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  console.log('Copy Enabler: Text selection and copying enabled!');
})();