function isValidCSV(text) {
  const lines = text.split('\n').filter(line => line.trim());
  if (!lines.length) return false;
  
  const delimiter = detectDelimiter(text);
  const timeRegex = /^\d{2}:\d{2}:\d{2}:\d{2}$/;
  
  return lines.every(line => {
    const columns = line.split(delimiter);
    return columns.length === 4 && timeRegex.test(columns[0]) && columns.slice(1).every(col => col.trim());
  });
}

function detectDelimiter(input) {
  const delimiters = [',', '|', '\t'];
  const delimiterCounts = delimiters.map(d => [d, 0]).reduce((acc, [d]) => ({...acc, [d]: 0}), {});

  input.split('\n').filter(line => line.trim()).forEach(line => {
    delimiters.forEach(delimiter => {
      const count = (line.split(delimiter).length - 1);
      delimiterCounts[delimiter] += count;
    });
  });

  return Object.keys(delimiterCounts).reduce((a, b) => delimiterCounts[a] > delimiterCounts[b] ? a : b);
}

async function convertTimeToMs(time, framesPerSecond = 25) {
  const parts = time.split(':');
  if (parts.length !== 4) throw new Error("Time string format is incorrect. Expected format is HH:MM:SS:FF.");
  
  const [hours, minutes, seconds, frames] = parts.map(Number);
  return (hours * 3600 + minutes * 60 + seconds) * 1000 + (frames / framesPerSecond) * 1000;
}

async function getFramesPerSecond(file) {
  try {
    const args = ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'default=noprint_wrappers=1:nokey=1', file[0].path];
    const output = await window.api.ffprobe(args);
    return parseFloat(output.trim());
  } catch (error) {
    console.error('Error running ffprobe:', error);
    throw error;
  }
}

async function getFileDuration(file) {
  try {
    const args = ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file[0].path];
    const output = await window.api.ffprobe(args);
    return parseFloat(output.trim()) * 1000;
  } catch (error) {
    console.error('Error running ffprobe:', error);
    throw error;
  }
}

async function mergeChatpersIntoFile(pathToFile, pathToChapters) {
  try {
    const file = pathToFile[0].path;
    const newVideoFilePath = await window.api.appendToFileName(file, '_withChapters');
      const args = ['-i', file, '-i', pathToChapters, '-map_metadata', '1', '-codec', 'copy', newVideoFilePath, '-y'];
    const output = await window.api.ffmpeg(args);
    return output;
  } catch (error) {
    console.error('Error running ffmpeg:', error);
    throw error;
  }     
}

async function getInputFileData(file) {
  const [inputFileDuration, inputFileFrameRate] = await Promise.all([getFileDuration(file), getFramesPerSecond(file)]);
  return { duration: inputFileDuration, fps: inputFileFrameRate };
}

function parseCsvData(input) {
  const delimiter = detectDelimiter(input);
  return input.trim().split('\n').map(line => line.split(delimiter));
}

function getChapterData(input) {
  return parseCsvData(input).map(([timecode, , , comment]) => ({ timecode, comment }));
}

function startCountdown(duration, onComplete) {
  let remaining = duration;
  const countdown = () => {
      console.log(remaining);
      remaining -= 1;
      if (remaining >= 0) {
          setTimeout(countdown, 1000);
      } else {
          onComplete();
      }
  };
  countdown();
}

async function createChapterData(chapters, fileData) {
  var chaptersContent = ";FFMETADATA1\n"
  for (let i = 0; i < chapters.length; i++) {
    const startChapterInMS = await convertTimeToMs(chapters[i].timecode, fileData.fps);
    let endChapterInMS = fileData.duration;
    const nextChapterIndex = i + 1;
    if (nextChapterIndex < chapters.length) {
      const nextChapter = chapters[nextChapterIndex];
      endChapterInMS = await convertTimeToMs(nextChapter.timecode, fileData.fps) - 1;
    }
    chaptersContent += '[CHAPTER]\n';
    chaptersContent += 'TIMEBASE=1/1000\n';
    chaptersContent += `START=${startChapterInMS}\n`
    chaptersContent += `END=${endChapterInMS}\n`
    chaptersContent += `title=${chapters[i].comment}\n\n`
  }
  return chaptersContent;
}

export {
  isValidCSV,
  convertTimeToMs,
  getInputFileData,
  getChapterData,
  startCountdown,
  mergeChatpersIntoFile,
  createChapterData
};