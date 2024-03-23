<div align="center">

# Chapter Injector

![Languages](https://img.shields.io/badge/Languages-Javascript%20|%20NodeJS-white?labelColor=orange&style=flat)

![Platforms](https://img.shields.io/badge/Platforms-Windows%20|%20macOS-white?labelColor=gray&style=flat)

![Licence](https://img.shields.io/badge/Licence-MIT-white?labelColor=blue&style=flat)

</div>

Chapter Injector is an electron app which quickly allows you to inject non-linear video editor markers into video files as chapter points.

## Usage

The app is very simple and easy to use.

1. Select an MP4 or MOV video file

1. Add in the CSV formatted chapter points to the text field

1. Press the `Inject Chapters` button

1. Done!

## How to format chapters

The text field area accepts any text, however only proper formatted text will allow the injection to work.

It expects to receive CSV data where the columns are separated by tab spaces (`\t`), commas (`,`), or pipes (`|`).

The app will automatically detect the delimiter based on the majority found in the text field (ie. the most tabs, commas, or pipes).

### Example chapter data

#### Tabs

```csv
00:00:30:00  V1  Blue  Chapter 01
00:01:00:00  V1  Blue  Chapter 02
00:01:30:00  V1  Blue  Chapter 03
00:02:00:00  V1  Blue  Chapter 04
00:02:30:00  V1  Blue  Chapter 05
```

#### Commas

```csv
00:00:30:00,V1,Blue,Chapter 01
00:01:00:00,V1,Blue,Chapter 02
00:01:30:00,V1,Blue,Chapter 03
00:02:00:00,V1,Blue,Chapter 04
00:02:30:00,V1,Blue,Chapter 05
```

#### Pipes

```csv
00:00:30:00|V1|Blue|Chapter 01
00:01:00:00|V1|Blue|Chapter 02
00:01:30:00|V1|Blue|Chapter 03
00:02:00:00|V1|Blue|Chapter 04
00:02:30:00|V1|Blue|Chapter 05
```

> [!Note]
> Only the first and last columns are used. Anything in-between is ignored.

### Column data

The app expects at least two columns for the CSV chapter data. If there are more than two columns then only the **first and last columns are used**.

The first column is the timecode in the format of `HH:MM:SS:FF`.

The second column is the chapter title.

## Running it

When you run the app, it extracts the location of the input MP4 or MOV file, and will output the new file next to it.

The new file will have a suffix `_withChapters` to the end of it.

Injecting chapters does not re-encode or alter the video file. It only adds in new metadata.

---

## For developers

### Command line - development mode

This opens the console automatically and enables live reloading.

```sh
npm run start:dev
```

### Command line - production mode

```sh
npm run start
```

### Files

| File | Description |
|-|-|
| `preload.mjs` | This is to expose the Electron / NodeJS APIs between the app and `renderer.mjs` |
| `renderer.mjs` | This is called in the `index.html` and initialises the app |
| `event-listeners.mjs` | Contains all the event listeners - click, keydown, etc. There are some shortcut key presses, mainly for debugging at this point |
| `helpers.mjs` | Helper functions that are neither app logic or UI components |
| `ui-components.mjs` | Builds the app UI |
| `app-logic.mjs` | All the app logic in terms of processing the data into chapter files, injecting it into the file, etc. |

---

## Contributing

Contributions are more than welcome. If you find a bug or have an idea for an enhancement, please open an issue or provide a pull request. Please follow the code style present in the current code base when making contributions.

## License

This package is released under the MIT license.
