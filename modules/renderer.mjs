import * as ui from './ui-components.mjs';
import * as events from './event-listeners.mjs';

const initializeApp = () => {
  document.addEventListener('DOMContentLoaded', () => {
    try {
      ui.buildUI();
      events.addEventListeners();
    } catch (error) {
      window.alert(`Initialization error: ${error.message}`);
    }
  });
};

initializeApp();
