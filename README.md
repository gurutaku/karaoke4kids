# SingSprout Christmas Karaoke

A kid-friendly, responsive karaoke app with English lyric lines externalized in `songs.json`. The player reads standard MIDI files from the same directory and synthesizes their notes in the browser using the Web Audio API. It does not require a paid API or a music service.

## Files

- `index.html` — the karaoke player and browser-side MIDI parser/synthesizer.
- `songs.json` — eight song entries, lyric lines, cue beats, and expected MIDI filenames.
- `MIDI_FILES_GO_HERE.txt` — the exact filenames expected by the app.

## Add the MIDI files

Place the matching `.mid` files beside `index.html` and `songs.json`, in this same directory. Use the filenames listed in `MIDI_FILES_GO_HERE.txt`. The MIDI files are intentionally not bundled because you will supply MIDI arrangements whose reuse rights you have checked.

## Run locally

Because the app fetches `songs.json` and MIDI files, do not open `index.html` directly from a `file://` URL. Run a local static server from this directory, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser. You can also upload the three app files and your MIDI files to the same folder on GitHub Pages.

## Lyric synchronization

Each line in `songs.json` has a `startBeat` property. These values are starter cues, currently spaced four quarter-note beats apart. The app reads the MIDI tempo map and converts beats to time, so it can follow tempo changes in a MIDI file. However, there is no universal timing that fits every arrangement. Adjust `startBeat` for each lyric line to match the chosen MIDI version. Choose arrangements with the same verses and repeats as the lyrics shown in `songs.json`.

The first version highlights one lyric line at a time. The synthesized timbre is intentionally simple and is not a General MIDI soundfont or studio-quality instrument bank.

## Notes on lyric text

The JSON includes selected traditional verses for each requested carol. Traditional carol texts have variants across songbooks, so you can edit the `lyrics` array to fit the arrangement you choose. The included beat markers are not guaranteed to be exact until checked against the actual MIDI file.
