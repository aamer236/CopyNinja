// Enable text selection and copying aggressively
(function() {
  'use strict';

  // List of events commonly blocked to prevent selection/copying
  const events = ['copy', 'cut', 'paste', 'contextmenu', 'selectstart', 'mousedown', 'mouseup'];
  
  // 1. Aggressive CSS Injection for user-select on all elements
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
    }
  `;
  
  // Inject style as early as possible on the root document element
  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.documentElement.appendChild(style); 
  }


  // 2. Global Event Overrides (Capture Phase)
  function enableCopyEvents(e) {
    e.stopPropagation(); // Stop the event from propagating further
    return true; // Allow the default action (copy/paste)
  }
  
  events.forEach(event => {
    // Crucial: Use 'true' for capture phase to catch events *before* they reach the blocking element
    document.addEventListener(event, enableCopyEvents, true);
  });
  
  // 3. Persistent DOM Cleanup and Attribute Removal
  function aggressiveCleanup() {
    
    // --- Step 3a: Target Root and Major Google Container Elements ---
    // These elements often hold the main anti-copy attributes/classes.
    const rootElements = [document.documentElement, document.body];
    if (document.getElementById('docs-editor-container')) {
        rootElements.push(document.getElementById('docs-editor-container')); // Google Docs container
    }
    if (document.getElementById('sheets-viewport')) {
        rootElements.push(document.getElementById('sheets-viewport')); // Google Sheets container
    }

    rootElements.forEach(el => {
        if (el) {
            // Remove attributes that block copy
            el.setAttribute('onselectstart', ''); 
            el.setAttribute('oncopy', '');
            el.setAttribute('oncontextmenu', '');
            el.removeAttribute('unselectable'); 
            
            // Force user-select style inline
            el.style.userSelect = 'text'; 
            el.style.webkitUserSelect = 'text';
            
            // Remove known Google anti-copy classes
            el.classList.remove('docsshared-no-select', 'docsshared-disabled', 'docs-userselect-none', 'noSelect');
        }
    });
    
    // --- Step 3b: Target All Elements for Generic Cleanup ---
    // Query and clean up any element with anti-copy attributes or classes
    const allElements = document.querySelectorAll('[onselectstart], [oncopy], [oncontextmenu], [unselectable], .docsshared-no-select, .docsshared-disabled, .docs-userselect-none');

    allElements.forEach(el => {
      el.removeAttribute('onselectstart');
      el.removeAttribute('oncopy');
      el.removeAttribute('oncontextmenu');
      el.removeAttribute('unselectable');
      el.style.userSelect = 'text';
      el.style.webkitUserSelect = 'text';
      el.classList.remove('docsshared-no-select', 'docsshared-disabled', 'docs-userselect-none', 'noSelect');
    });

    // --- Step 3c: Clear inline event handlers (re-enforcement) ---
    document.querySelectorAll('*').forEach(el => {
      events.forEach(event => {
        el[`on${event}`] = null;
      });
    });
  }

  // Run initial cleanup
  aggressiveCleanup();
  
  // 4. MutationObserver for Dynamic Content
  // Google Docs/Sheets constantly modifies the DOM and re-applies restrictions. 
  // This observer ensures the cleanup runs every time the DOM structure or an attribute changes.
  const observer = new MutationObserver(() => {
    aggressiveCleanup();
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true, // Watch for new elements
      subtree: true,   // Watch all descendants
      attributes: true // Crucial: Watch for attribute changes (like class/style)
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });
    });
  }

  // 5. Prototype Override for future event listeners
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (events.includes(type)) {
        // Prevent new copy-blocking listeners from ever being attached
        return; 
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  console.log('Copy Enabler: Text selection and copying enabled!');
})();