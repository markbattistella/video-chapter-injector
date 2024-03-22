import * as ui from './ui-components.mjs';
import * as helper from './helpers.mjs';

export const pasteFromClipboardHandler = async () => {
  const clipboardText = await window.api.pasteFromClipboard();
  if (clipboardText) {
    ui.textareaCSV.value = clipboardText;
    validateCSV();
  }
};

export const debugPaste = () => {
  ui.textareaCSV.value = 
    '00:00:30:00\tV1\tBlue\tChapter 01\n' +
    '00:01:00:00\tV1\tBlue\tChapter 02\n' +
    '00:01:30:00\tV1\tBlue\tChapter 03\n' +
    '00:02:00:00\tV1\tBlue\tChapter 04\n' +
    '00:02:30:00\tV1\tBlue\tChapter 05\n' +
    '00:03:00:00\tV1\tBlue\tChapter 06\n' +
    '00:03:30:00\tV1\tBlue\tChapter 07\n' +
    '00:04:00:00\tV1\tBlue\tChapter 08\n' +
    '00:04:30:00\tV1\tBlue\tChapter 09\n';
};

export const validateCSV = () => {
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

export const checkButtonState = () => {
  const fileSelected = ui.inputSelectFile.files.length > 0;
  const csvNotEmpty = ui.textareaCSV.value.trim() !== '';
  if (fileSelected && csvNotEmpty) {
    ui.buttonSubmit.removeAttribute('disabled');
  } else {
    ui.buttonSubmit.setAttribute('disabled', 'disabled');
  }
};

export const resetApp = () => {
  ui.inputSelectFile.value = '';
  ui.textareaCSV.value = '';
  checkButtonState();
  validateCSV();
};

export const injectChapters = async () => {
  const fileSelected = ui.inputSelectFile.files.length > 0;
  const csvIsEmpty = ui.textareaCSV.value.trim() === '';
  if (!fileSelected || csvIsEmpty) { return; }

  const files = ui.inputSelectFile.files;
  const filePath = files[0];

  console.log(files);
  console.log(filePath);

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
  const chapterData = await createChapterData(csvData, fileData);
  await window.api.writeContentToFile(createTempFile, chapterData);

  const newVideoFilePath = await window.api.appendToFileName(filePath.path, '_withChapters');
  console.log('newVideoFilePath:', newVideoFilePath);

  
  await mergeChatpersIntoFile(files, createTempFile);


  startCountdown(10, async () => {
    await window.api.deleteFile(createTempFile);
    resetApp();
    console.clear();
  });
};



async function mergeChatpersIntoFile(pathToFile, pathToChapters) {
  try {
    const file = pathToFile[0].path;
    const newVideoFilePath = await window.api.appendToFileName(file, '_withChapters');
      const args = [
      '-i', file,
      '-i', pathToChapters,
      '-map_metadata', '1',
      '-codec', 'copy',
      newVideoFilePath, '-y'
    ];
    // await window.api.ffmpeg(args);
    
  } catch (error) {
    console.error('Error running ffmpeg:', error);
    throw error;
  }     
}
   



function startCountdown(duration, onComplete) {
  let remaining = duration;
  const countdown = () => {
      console.log(remaining);
      remaining -= 1;
      if (remaining >= 0) {
          setTimeout(countdown, 1000); // Call countdown again after 1 second
      } else {
          onComplete(); // Call the custom function once the countdown reaches 0
      }
  };
  countdown(); // Start the countdown
}



async function createChapterData(chapters, fileData) {
  var chaptersContent = ";FFMETADATA1\n"
  for (let i = 0; i < chapters.length; i++) {

    const startChapterInMS = await helper.convertTimeToMs(chapters[i].timecode, fileData.fps);
    let endChapterInMS = fileData.duration;

    const nextChapterIndex = i + 1;
    if (nextChapterIndex < chapters.length) {
      const nextChapter = chapters[nextChapterIndex];
      endChapterInMS = await helper.convertTimeToMs(nextChapter.timecode, fileData.fps) - 1;
    }

    chaptersContent += '[CHAPTER]\n';
    chaptersContent += 'TIMEBASE=1/1000\n';
    chaptersContent += `START=${startChapterInMS}\n`
    chaptersContent += `END=${endChapterInMS}\n`
    chaptersContent += `title=${chapters[i].comment}\n\n`
  }

  return chaptersContent;
}