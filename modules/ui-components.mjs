// Constants: internal
const body = document.querySelector('body');

const textareaCSV = createTextarea();
const buttonPaste = createButton('Paste from clipboard', ['button', 'pale']);
const buttonReset = createButton('Reset', ['button', 'red']);
const buttonInfo = createButton('Help', []);
const inputSelectFile = createInputFile();
const buttonSubmit = createButton('Inject chapters', ['button', 'blue'], true);
const divPopOverlay = document.createElement('div');

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
  source.setAttribute('src', 'instructions.mp4');
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

  const h2_1 = document.createElement('h2');
  const h2_2 = document.createElement('h2');
  const hr = document.createElement('hr');
  const ol = document.createElement('ol');
  const li_1 = document.createElement('li');
  const li_2 = document.createElement('li');
  const li_3 = document.createElement('li');
  const p = document.createElement('p');
  const button = createButton('Done', ['button', 'full-width']);

  h2_1.textContent = 'How to use';
  li_1.textContent = 'Select an MP4 or MOV video file';
  li_2.textContent = 'Copy the Markers list from Avid Media Composer, any NLE, or CSV data';
  li_3.textContent = 'Inject Chapters';
  h2_2.textContent = 'How to format your chapters';
  p.innerHTML = 'The chapter text field expects CSV data. If you copy the markers list from Avid Media Composer this is already formatted in tab separated values.<br>The important parts of the field are that the first column is in the format <kbd>HH:MM:SS:FF</kbd>, and the last column is the chapter title name. Any columns between those will be ignored in the injection.<br>Some example formats for the chapter CSV data can be:<pre>HH:MM:SS:FF\tChapter title  // tab spaces</pre><pre>HH:MM:SS:FF,Chapter title    // commas</pre><pre>HH:MM:SS:FF|Chapter title    // pipes</pre>';

  ol.appendChild(li_1);
  ol.appendChild(li_2);
  ol.appendChild(li_3);

  infoContainer.appendChild(hr);
  infoContainer.appendChild(h2_1);
  infoContainer.appendChild(ol);
  infoContainer.appendChild(hr);
  infoContainer.appendChild(h2_2);
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

const buildUI = () => {
  const formElement = createFormElement();
  body.appendChild(formElement);
  buildPopover(); // Initialize popover as part of UI setup
};

const showPanel = () => {
  divPopOverlay.classList.remove('hidden');
  const video = document.querySelector('video');
  video.currentTime = 0;
  video.play();
};



export {
  textareaCSV,
  buttonPaste,
  buttonReset,
  buttonInfo,
  inputSelectFile,
  buttonSubmit,
  divPopOverlay,
  buildUI,
  showPanel
};
