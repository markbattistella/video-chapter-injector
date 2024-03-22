# Chapter Injector

This app is designed to inject chapters into `MP4` or `MOV` files.

The chapters are in the format of CSV data, but is mainly designed for Avid Media Composer markers export:

```text
00:00:30:00	V1	Blue	Chapter 01
00:01:00:00	V1	Blue	Chapter 02
00:01:30:00	V1	Blue	Chapter 03
00:02:00:00	V1	Blue	Chapter 04
00:02:30:00	V1	Blue	Chapter 05
00:03:00:00	V1	Blue	Chapter 06
00:03:30:00	V1	Blue	Chapter 07
00:04:00:00	V1	Blue	Chapter 08
00:04:30:00	V1	Blue	Chapter 09
```

Where it is the format:

`HH:MM:SS:FF - TRACK - COLOUR - TITLE`

And separated by a tab `\t`.

---

## Files

### `preload.mjs`

This is to expose the Electron / NodeJS APIs between the app and `renderer.mjs`.

### `renderer.mjs`

This is called in the `index.html` and initialises the app.

### `event-listeners.mjs`

Contains all the event listeners - click, keydown, etc. There are some shortcut key presses, mainly for debugging at this point.

### `helpers.mjs`

Helper functions that are neither app logic or UI components.

### `ui-components.mjs`

Builds the app UI.

**Note:** There is a pop up panel which is in extreme testing phase. It doesn't need addressing in this scope.

### `app-logic.mjs`

All the app logic in terms of processing the data into chapter files, injecting it into the file, etc.

---

## Usage

There is a `test-video.mp4` in the `_test` directory which can be used for testing the app.

When the `chapters.txt` file is created it is created next to the input file.

The output video - suffixed with `_withChapters` - will be placed next to the input video too.

---

## Issues

When running the `ffmpeg` functionality, it seems the app resets and does not progress to the resetting of the app correctly or clearing the console.

It appears once `ffmepg` runs, it re-initialises the app completely.

### Additional

It would be nice for some better refactoring, and cleanup.

This app won't need any changes after it has been made as this is fairly standardised across the `ffmpeg` platform and chapter metadata.

There would be benefits for checking that any of the temp files are deleted when run too so clashes do not cause issues.
