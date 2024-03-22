// Constants: internal
const body = document.querySelector('body');

export const textareaCSV = createTextarea();
export const buttonPaste = createButton('Paste from clipboard', ['button', 'pale']);
export const buttonReset = createButton('Reset', ['button', 'red']);
export const buttonInfo = createButton('Help', []);
export const inputSelectFile = createInputFile();
export const buttonSubmit = createButton('Inject chapters', ['button', 'blue'], true);
export const divPopOverlay = document.createElement('div');

function createButton(text, classes = [], disabled = false) {
  const button = document.createElement('a');
  button.textContent = text;
  button.classList.add(...classes);
  if (disabled) button.setAttribute('disabled', 'disabled');
  return button;
};

function createTextarea() {
  const textarea = document.createElement('textarea');
  const placeholder = '// Add chapters here - use MC format\n00:00:00:00\tV1\tBlue\tChapter 01';
  textarea.setAttribute('rows', '16');
  textarea.setAttribute('placeholder', placeholder);
  textarea.setAttribute('autocorrect', 'false');
  return textarea;
};

function createInputFile() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', '.mov,.mp4');
  return input;
};

function createFormElement() {
  const formElement = document.createElement('form');
  appendChildElements(formElement, [
    createDivWithChildren(
      'divInputSelectFile',
      'line',
      [inputSelectFile]
    ),
    createDivWithChildren(
      'divTextareaCSV',
      'line',
      [textareaCSV],
      'paste-button',
      [buttonPaste]
    ),
    createDivWithChildren(
      'divButtonSubmit',
      'line buttons',
      [buttonSubmit, buttonReset]
    ),
    createFooter()
  ]);
  return formElement;
}

function createDivWithChildren(
  id, classes, children, additionalClass = '', additionalChildren = []
) {
  const div = document.createElement('div');
  div.id = id;
  div.classList.add(...classes.split(' '));
  if (additionalClass && additionalChildren.length > 0) {
    // Create an additional div for specific children
    const additionalDiv = document.createElement('div');
    additionalDiv.classList.add(additionalClass);
    additionalChildren.forEach(child => additionalDiv.appendChild(child));
    div.appendChild(additionalDiv);
  }
  children.forEach(child => {
    if (!additionalChildren.includes(child)) {
      div.appendChild(child);
    }
  });
  return div;
}

const createFooter = () => {
  const footer = document.createElement('footer');
  const copyright = document.createElement('div');
  const author = document.createElement('strong');
  const currentYear = new Date().getFullYear();
  author.textContent = 'Mark Battistella';
  copyright.innerHTML = `&copy; 2010-${currentYear} ${author.outerHTML}`;
  footer.appendChild(copyright);
  footer.appendChild(buttonInfo);
  return footer;
};

const appendChildElements = (parent, children) => {
  children.forEach(child => parent.appendChild(child));
};

const buildPopover = () => {
  divPopOverlay.classList.add('hidden', 'popover');
  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-container');
  const video = document.createElement('video');
  video.setAttribute('autoplay', 'true');
  video.setAttribute('loop', 'true');
  const source = document.createElement('source');
  source.setAttribute('src', 'info.mp4');
  source.setAttribute('type', 'video/mp4');
  video.appendChild(source);
  const infoContainer = createInfoContainer();
  videoContainer.appendChild(video);
  divPopOverlay.append(videoContainer, infoContainer);
  body.appendChild(divPopOverlay);
  videoEventListeners(video);
};

const createInfoContainer = () => {
  const infoContainer = document.createElement('div');
  const h1 = document.createElement('h1');
  h1.textContent = 'Video Chapter Injector';
  const hr1 = document.createElement('hr');
  const h2 = document.createElement('h2');
  h2.textContent = 'USAGE';
  const ol = document.createElement('ol');
  const li1 = document.createElement('li');
  li1.textContent = 'Select a file (MP4 or MOV files)';
  const li2 = document.createElement('li');
  li2.textContent = 'Copy the Markers list from Avid MC';
  const li3 = document.createElement('li');
  li3.textContent = 'Press "Inject Chapters"';
  ol.appendChild(li1);
  ol.appendChild(li2);
  ol.appendChild(li3);
  const hr2 = document.createElement('hr');
  const blockquote = document.createElement('blockquote');
  blockquote.textContent = 'Note: Chapter points must be in the following format';
  const pre = document.createElement('pre');
  pre.textContent = 'HH:MM:SS:FF\tT#\tColor\tName';

  const p = document.createElement('p');
  p.innerHTML = 'Where the timecode (<kbd>HH:MM:SS:FF</kbd>), track number (<kbd>T#</kbd>), marker colour (<kbd>Color</kbd>), and chapter name (<kbd>Name</kbd>) are all separated by <u>one</u> tab character';
  const button = createButton('Done', ['button', 'full-width']);
  infoContainer.appendChild(h1);
  infoContainer.appendChild(hr1);
  infoContainer.appendChild(h2);
  infoContainer.appendChild(ol);
  infoContainer.appendChild(hr2);
  infoContainer.appendChild(blockquote);
  blockquote.appendChild(pre);
  infoContainer.appendChild(p);
  infoContainer.appendChild(button);
  button.addEventListener('click', hidePopover);

  return infoContainer;
};

const videoEventListeners = (video) => {
  video.addEventListener('loadedmetadata', () => {
    if (!divPopOverlay.classList.contains('hidden')) {
      console.log('appeared');
      video.play();
    }
  });
};

const hidePopover = () => {
  divPopOverlay.classList.add('hidden');
  const video = document.querySelector('video');
  video.pause();
};

export const buildUI = () => {
  const formElement = createFormElement();
  body.appendChild(formElement);
  buildPopover(); // Initialize popover as part of UI setup
};

export const showPanel = () => {
  divPopOverlay.classList.remove('hidden');
  const video = document.querySelector('video');
  video.currentTime = 0;
  video.play();
};
