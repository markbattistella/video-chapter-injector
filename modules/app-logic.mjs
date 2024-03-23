import * as ui from './ui-components.mjs';
import * as helper from './helpers.mjs';

const pasteFromClipboardHandler = async () => {
  const clipboardText = await window.api.pasteFromClipboard();
  if (clipboardText) {
    ui.textareaCSV.value = clipboardText;
    validateCSV();
  }
};

const debugPaste = () => {
  ui.textareaCSV.value = `00:00:30:00\tV1\tBlue\tChapter 01
00:01:00:00\tV1\tBlue\tChapter 02
00:01:30:00\tV1\tBlue\tChapter 03
00:02:00:00\tV1\tBlue\tChapter 04
00:02:30:00\tV1\tBlue\tChapter 05
00:03:00:00\tV1\tBlue\tChapter 06
00:03:30:00\tV1\tBlue\tChapter 07
00:04:00:00\tV1\tBlue\tChapter 08
00:04:30:00\tV1\tBlue\tChapter 09`;
};

const validateCSV = () => {
  const textareaCSVData = ui.textareaCSV.value;
  if (textareaCSVData.trim() == '') {
    ui.textareaCSV.classList.remove('valid');
    ui.textareaCSV.classList.remove('invalid');
    return;
  }
  const isValid = helper.isValidCSV(textareaCSVData);
  if (isValid) {
    ui.textareaCSV.classList.remove('invalid');
    ui.textareaCSV.classList.add('valid');
    checkButtonState();
  } else {
    ui.textareaCSV.classList.add('invalid');
    ui.textareaCSV.classList.remove('valid');
    ui.buttonSubmit.setAttribute('disabled', 'disabled');
  }
};

const checkButtonState = () => {
  const fileSelected = ui.inputSelectFile.files.length > 0;
  const csvNotEmpty = ui.textareaCSV.value.trim() !== '';
  if (fileSelected && csvNotEmpty) {
    ui.buttonSubmit.removeAttribute('disabled');
  } else {
    ui.buttonSubmit.setAttribute('disabled', 'disabled');
  }
};

const resetApp = () => {
  ui.inputSelectFile.value = '';
  ui.textareaCSV.value = '';
  checkButtonState();
  validateCSV();
};

const injectChapters = async () => {
  const fileSelected = ui.inputSelectFile.files.length > 0;
  const csvIsEmpty = ui.textareaCSV.value.trim() === '';
  if (!fileSelected || csvIsEmpty) { return; }

  const files = ui.inputSelectFile.files;
  const filePath = files[0];

  const fileData = await helper.getInputFileData(files);
  const csvData = helper.getChapterData(ui.textareaCSV.value);

  const lastChapterInMS = await helper.convertTimeToMs(
    csvData[csvData.length - 1].timecode,
    fileData.fps
  );

  if (lastChapterInMS > fileData.duration) {
    console.error('Last chapter is outside the length of the input file duration');
    return;
  }

  const createTempFile = await window.api.createFile(files, 'tempChapters.txt');
  const chapterData = await helper.createChapterData(csvData, fileData);
  await window.api.writeContentToFile(createTempFile, chapterData);

  await window.api.appendToFileName(filePath.path, '_withChapters');

  await helper.mergeChatpersIntoFile(files, createTempFile);
  await window.api.deleteFile(createTempFile);

  helper.startCountdown(5, async () => {
    resetApp();
    console.clear();
  });
};

export {
  pasteFromClipboardHandler,
  debugPaste,
  validateCSV,
  checkButtonState,
  resetApp,
  injectChapters
}