import { 
  inputSelectFile,
  textareaCSV,
  buttonReset,
  buttonPaste,
  buttonInfo,
  buttonSubmit,
  showPanel
} from "./ui-components.mjs";

import {
  checkButtonState,
  validateCSV,
  resetApp,
  pasteFromClipboardHandler,
  injectChapters,
  debugPaste
} from "./app-logic.mjs";

const addEventListeners = () => {
  inputSelectFile.addEventListener('input', checkButtonState);
  textareaCSV.addEventListener('input', validateCSV);
  buttonReset.addEventListener('click', resetApp);
  buttonPaste.addEventListener('click', pasteFromClipboardHandler);
  buttonInfo.addEventListener('click', showPanel);
  buttonSubmit.addEventListener('click', injectChapters);

  document.querySelector('footer strong').addEventListener('click', () => window.api.openUrlInBrowser('https://markbattistella.com'));

  // Refactored keyboard shortcuts to a more streamlined setup
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      resetApp();
    } else {
      const isCmdOrCtrl = event.ctrlKey || event.metaKey;
      const actionMap = {
        's': () => { debugPaste(); validateCSV(); },
        'i': pasteFromClipboardHandler,
        'r': injectChapters
      };

      const action = actionMap[event.key.toLowerCase()];
      if (action && isCmdOrCtrl) {
        action();
        event.preventDefault();
      }
    }
  });
};

export { addEventListeners };
