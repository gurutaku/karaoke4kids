        import { Sequencer, WorkletSynthesizer } from "https://esm.sh/spessasynth_lib@4.3.14";
        'use strict';
        (() => {
            const $ = id => document.getElementById(id);
            const SOUND_FONT_URL = 'https://spessasus.github.io/SpessaSynth/soundfonts/GeneralUserGS.sf3';
            const WORKLET_URL = 'https://cdn.jsdelivr.net/npm/spessasynth_lib@4.3.14/dist/spessasynth_processor.min.js';
            let songs = [], songIndex = 0, audioCtx = null, masterGain = null, synth = null, sequencer = null;
            let midiData = null, lineCues = [], durationSec = 0, playing = false, paused = false, ended = false, rafId = 0, speed = 1, volume = .6, activeLine = -1;
            let lyricOnly = false, lastError = '';
            const currentSong = () => songs[songIndex];
            const fmt = seconds => { const s = Math.max(0, Math.floor(seconds || 0)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
            function setStatus(message, live = false) { $('statusText').textContent = message; $('playStatus').classList.toggle('live', !!live); }
            function showWarning(message) { const el = $('warningBox'); el.textContent = message; el.classList.add('show'); }
            function clearWarning() { $('warningBox').textContent = ''; $('warningBox').classList.remove('show'); }
            function updatePlayButton() { if (playing) { $('playIcon').textContent = 'Ⅱ'; $('playLabel').textContent = 'Pause music'; } else if (paused) { $('playIcon').textContent = '▶'; $('playLabel').textContent = 'Keep singing'; } else if (ended) { $('playIcon').textContent = '↻'; $('playLabel').textContent = 'Sing again'; } else { $('playIcon').textContent = '▶'; $('playLabel').textContent = 'Start singing'; } }
            function updateProgress(elapsed) { const val = Math.max(0, Math.min(durationSec, elapsed || 0)); const pct = durationSec ? val / durationSec * 100 : 0; $('progressFill').style.width = `${pct}%`; $('progressTrack').setAttribute('aria-valuenow', String(Math.round(pct))); $('elapsedText').textContent = fmt(val); $('durationText').textContent = fmt(durationSec); }
            function renderCards() {
                const query = $('songSearch').value.trim().toLowerCase(); const root = $('songGrid'); root.innerHTML = ''; let visible = 0;
                songs.forEach((song, index) => {
                    if (query && !`${song.title} ${song.description} ${song.mood}`.toLowerCase().includes(query)) return; visible++;
                    const b = document.createElement('button'); b.type = 'button'; b.className = `song-card${index === songIndex ? ' selected' : ''}`; b.dataset.theme = song.theme; b.setAttribute('aria-pressed', String(index === songIndex));
                    const emoji = document.createElement('span'); emoji.className = 'song-emoji'; emoji.textContent = song.emoji; emoji.setAttribute('aria-hidden', 'true');
                    const title = document.createElement('strong'); title.textContent = song.title;
                    const desc = document.createElement('span'); desc.className = 'desc'; desc.textContent = song.description;
                    const meta = document.createElement('span'); meta.className = 'song-meta'; const t1 = document.createElement('span'); t1.className = 'tag'; t1.textContent = '♫ ' + song.mood; const t2 = document.createElement('span'); t2.className = 'tag'; t2.textContent = song.lyrics.length + ' lines'; meta.append(t1, t2); b.append(emoji, title, desc, meta); b.addEventListener('click', () => chooseSong(index)); root.appendChild(b);
                });
                $('songCount').textContent = query ? `${visible} of ${songs.length} songs` : `${songs.length} songs`; if (!visible) root.innerHTML = '<div class="empty-state">No songs found. Try another title or keyword.</div>';
            }
            function renderLyrics() {
                const root = $('lyricsWindow'); root.innerHTML = ''; const song = currentSong();
                song.lyrics.forEach((line, i) => { const el = document.createElement('div'); el.className = 'lyric-line'; el.id = `lyric-${i}`; el.textContent = line.text; root.appendChild(el); }); activeLine = -1;
                if (song.lyrics.length) highlight(0, false);
            }
            function updateHeader() { const s = currentSong(); $('coverEmoji').textContent = s.emoji; $('stageSongTitle').textContent = s.title; $('stageSongMeta').textContent = `${s.mood} · MIDI file: ${s.midi}`; }
            function chooseSong(index) { haltAudio(); songIndex = index; midiData = null; lineCues = []; playing = false; paused = false; ended = false; lyricOnly = false; durationSec = 0; renderCards(); renderLyrics(); updateHeader(); updateProgress(0); setStatus('Ready to sing'); updatePlayButton(); clearWarning(); }
            function haltAudio() {
                if (sequencer) {
                    try {
                        sequencer.pause();
                        sequencer.currentTime = 0;
                    } catch (e) { }
                }
                if (rafId) cancelAnimationFrame(rafId);
                rafId = 0;
            }

            async function getPlayer() {
                if (sequencer) return;

                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) {
                    throw new Error('Audio is not supported by this browser. Try a recent Chrome, Edge, or Safari.');
                }

                audioCtx = new AudioContextClass();
                masterGain = audioCtx.createGain();
                masterGain.gain.value = volume;
                masterGain.connect(audioCtx.destination);

                // The processor and library use the same pinned release.
                await audioCtx.audioWorklet.addModule(WORKLET_URL);
                synth = new WorkletSynthesizer(audioCtx);
                synth.connect(masterGain);

                const response = await fetch(SOUND_FONT_URL, { cache: 'force-cache' });
                if (!response.ok) {
                    throw new Error('Could not load the General MIDI instrument SoundFont. Check your internet connection and try again.');
                }
                const soundBank = await response.arrayBuffer();
                await synth.soundBankManager.addSoundBank(soundBank, 'main');

                sequencer = new Sequencer(synth);
                sequencer.loopCount = 0;
            }
            function readU16(bytes, pos) { return (bytes[pos] << 8) | bytes[pos + 1]; }
            function readU32(bytes, pos) { return (bytes[pos] * 16777216) + (bytes[pos + 1] << 16) + (bytes[pos + 2] << 8) + bytes[pos + 3]; }
            function readVar(bytes, state, end) { let value = 0, count = 0, byte; do { if (state.pos >= end) throw new Error('Unexpected end of MIDI data while reading event length.'); byte = bytes[state.pos++]; value = (value << 7) | (byte & 127); if (++count > 4) throw new Error('Invalid MIDI variable-length number.'); } while (byte & 128); return value; }
            function ascii(bytes, pos, count) { return String.fromCharCode(...bytes.slice(pos, pos + count)); }
            function parseMidi(buffer) {
                const bytes = new Uint8Array(buffer); if (bytes.length < 14 || ascii(bytes, 0, 4) !== 'MThd') throw new Error('This file is not a standard MIDI file.');
                const headerLen = readU32(bytes, 4); const format = readU16(bytes, 8); const trackCount = readU16(bytes, 10); const division = readU16(bytes, 12); if (division & 0x8000) throw new Error('SMPTE-time MIDI is not supported; please use a standard beats-per-minute MIDI file.');
                const ppq = division; if (!ppq) throw new Error('This MIDI file has an invalid timing division.'); let offset = 8 + headerLen; const tempoEvents = [{ tick: 0, micros: 500000 }]; const tracks = []; let maxTick = 0;
                for (let tr = 0; tr < trackCount && offset + 8 <= bytes.length; tr++) {
                    const type = ascii(bytes, offset, 4), length = readU32(bytes, offset + 4), begin = offset + 8, end = Math.min(begin + length, bytes.length); offset = begin + length; if (type !== 'MTrk') continue;
                    const state = { pos: begin }; let tick = 0, running = 0, lastTick = 0; const notes = []; const programs = Array(16).fill(0); const active = new Map();
                    while (state.pos < end) {
                        tick += readVar(bytes, state, end); lastTick = tick; if (state.pos >= end) break;
                        let status, firstData = null; const peek = bytes[state.pos];
                        if (peek & 128) { status = bytes[state.pos++]; if (status < 240) running = status; } else { status = running; firstData = bytes[state.pos++]; if (!status) throw new Error('MIDI event has no running status.'); }
                        if (status === 255) { if (state.pos >= end) break; const meta = bytes[state.pos++], n = readVar(bytes, state, end); if (meta === 81 && n >= 3 && state.pos + 2 < end) { const micros = (bytes[state.pos] << 16) | (bytes[state.pos + 1] << 8) | bytes[state.pos + 2]; tempoEvents.push({ tick, micros }); } state.pos = Math.min(end, state.pos + n); continue; }
                        if (status === 240 || status === 247) { const n = readVar(bytes, state, end); state.pos = Math.min(end, state.pos + n); continue; }
                        if (status >= 240) continue;
                        const kind = status >> 4, channel = status & 15; let d1 = firstData === null ? bytes[state.pos++] : firstData; let d2 = 0; if (kind !== 12 && kind !== 13) d2 = bytes[state.pos++];
                        if (kind === 12) { programs[channel] = d1; continue; }
                        if (kind === 9 && d2 > 0) { const key = channel + ':' + d1; if (!active.has(key)) active.set(key, []); active.get(key).push({ tick, pitch: d1, velocity: d2 / 127, channel, program: programs[channel], percussion: channel === 9 }); }
                        else if (kind === 8 || (kind === 9 && d2 === 0)) { const key = channel + ':' + d1, stack = active.get(key); if (stack && stack.length) { const note = stack.pop(); note.endTick = Math.max(tick, note.tick + 1); notes.push(note); if (!stack.length) active.delete(key); } }
                    }
                    maxTick = Math.max(maxTick, lastTick); for (const stack of active.values()) for (const note of stack) { note.endTick = Math.max(lastTick, note.tick + ppq / 2); notes.push(note); maxTick = Math.max(maxTick, note.endTick); }
                    tracks.push({ notes });
                }
                tempoEvents.sort((a, b) => a.tick - b.tick); const tempos = []; for (const ev of tempoEvents) { if (tempos.length && tempos[tempos.length - 1].tick === ev.tick) tempos[tempos.length - 1] = ev; else tempos.push(ev); } if (!tempos.length || tempos[0].tick !== 0) tempos.unshift({ tick: 0, micros: 500000 });
                function tickToSeconds(target) { let sec = 0, prev = 0, micros = 500000; for (const t of tempos) { if (t.tick === 0) { micros = t.micros; continue; } if (t.tick > target) break; sec += (t.tick - prev) / ppq * micros / 1000000; prev = t.tick; micros = t.micros; } sec += (target - prev) / ppq * micros / 1000000; return sec; }
                let duration = 0, totalNotes = 0; for (const track of tracks) { track.notes.forEach(n => { n.time = tickToSeconds(n.tick); n.duration = Math.max(.05, tickToSeconds(n.endTick) - n.time); delete n.tick; delete n.endTick; duration = Math.max(duration, n.time + n.duration); totalNotes++; }); }
                if (!totalNotes) throw new Error('This MIDI file has no playable notes.'); return { format, ppq, tracks, tempos, duration, totalNotes, tickToSeconds };
            }
            async function fetchMidi(song) {
                const response = await fetch(song.midi, { cache: 'no-store' });
                if (!response.ok) {
                    throw new Error(`Could not find ${song.midi}. Put the original MIDI file in the same directory as index.html and songs.json.`);
                }
                const buffer = await response.arrayBuffer();
                return { buffer, parsed: parseMidi(buffer) };
            }
            function beatToSeconds(beat) { return midiData.tickToSeconds(Math.max(0, beat) * midiData.ppq); }
            function prepareTimeline(song) { lineCues = song.lyrics.map((line, index) => ({ index, time: beatToSeconds(line.startBeat || 0), text: line.text })); lineCues.sort((a, b) => a.time - b.time); durationSec = Math.max(midiData.duration, (lineCues.length ? lineCues[lineCues.length - 1].time + 2 : 0)); }
            async function startPlayback() {
                try {
                    clearWarning();
                    haltAudio();
                    playing = false;
                    paused = false;
                    ended = false;
                    lyricOnly = false;
                    setStatus('Loading original MIDI…');
                    updatePlayButton();

                    await getPlayer();
                    if (audioCtx.state !== 'running') await audioCtx.resume();

                    const loaded = await fetchMidi(currentSong());
                    midiData = loaded.parsed;
                    prepareTimeline(currentSong());

                    sequencer.loadNewSongList([{
                        binary: loaded.buffer,
                        fileName: currentSong().title
                    }]);
                    sequencer.playbackRate = speed;
                    sequencer.play();

                    playing = true;
                    paused = false;
                    ended = false;
                    setStatus('Playing original MIDI arrangement', true);
                    updatePlayButton();
                    updateProgress(0);
                    renderFrame();
                } catch (e) {
                    playing = false;
                    paused = false;
                    updatePlayButton();
                    lastError = e.message || 'Could not play the original MIDI file.';
                    setStatus('MIDI playback unavailable');
                    showWarning(lastError);
                }
            }

            async function togglePlayback() {
                if (playing) {
                    if (sequencer) sequencer.pause();
                    playing = false;
                    paused = true;
                    if (rafId) cancelAnimationFrame(rafId);
                    rafId = 0;
                    setStatus('Paused — take a breath');
                    updatePlayButton();
                    return;
                }

                if (paused && sequencer && midiData) {
                    try {
                        if (audioCtx.state !== 'running') await audioCtx.resume();
                        sequencer.playbackRate = speed;
                        sequencer.play();
                        playing = true;
                        paused = false;
                        setStatus('Music is playing', true);
                        updatePlayButton();
                        renderFrame();
                        return;
                    } catch (e) {
                        // Reload the selected original MIDI if resume fails.
                    }
                }
                await startPlayback();
            }

            function stopAndRewind() {
                haltAudio();
                playing = false;
                paused = false;
                ended = false;
                highlight(0, false);
                updateProgress(0);
                setStatus('Ready to sing');
                updatePlayButton();
            }

            function highlight(index, scroll = true) { $('lyricsWindow').querySelectorAll('.lyric-line').forEach((el, n) => { el.classList.toggle('active', n === index); el.classList.toggle('done', n < index); if (n === index && scroll) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }); activeLine = index; }
            function renderFrame() {
                if (!playing || !sequencer) return;

                const elapsed = Math.max(0, Number(sequencer.currentTime) || 0);
                const musicDuration = midiData ? midiData.duration : durationSec;
                const finished = (!!sequencer.isFinished && elapsed > 0.05) ||
                    (musicDuration > 0 && elapsed >= musicDuration);

                if (finished) {
                    playing = false;
                    paused = false;
                    ended = true;
                    updateProgress(durationSec);
                    if (currentSong().lyrics.length) highlight(currentSong().lyrics.length - 1, false);
                    setStatus('Wonderful singing! ✨');
                    updatePlayButton();
                    rafId = 0;
                    return;
                }

                let line = 0;
                for (let i = 0; i < lineCues.length; i++) {
                    if (lineCues[i].time <= elapsed) line = i;
                    else break;
                }
                if (line !== activeLine) highlight(line, true);
                updateProgress(Math.min(elapsed, durationSec));
                rafId = requestAnimationFrame(renderFrame);
            }
            async function loadSongs() { const response = await fetch('songs.json', { cache: 'no-store' }); if (!response.ok) throw new Error('Could not load songs.json. Keep it beside index.html and run the app through a web server or GitHub Pages.'); const data = await response.json(); if (!Array.isArray(data.songs) || !data.songs.length) throw new Error('songs.json has no songs list.'); return data.songs; }
            $('playBtn').addEventListener('click', togglePlayback); $('stopBtn').addEventListener('click', stopAndRewind); $('songSearch').addEventListener('input', renderCards);
            $('volumeSlider').addEventListener('input', e => { volume = Number(e.target.value) / 100; $('volumeValue').textContent = e.target.value + '%'; if (masterGain && audioCtx) masterGain.gain.setTargetAtTime(volume, audioCtx.currentTime, .025); });
            $('tempoSlider').addEventListener('input', e => { speed = Number(e.target.value) / 100; $('tempoValue').textContent = e.target.value + '%'; if (sequencer) sequencer.playbackRate = speed; });
            (async () => { try { songs = await loadSongs(); renderCards(); updateHeader(); renderLyrics(); setStatus('Ready to sing'); updateProgress(0); } catch (e) { setStatus('Could not load library'); showWarning(e.message); $('stageSongTitle').textContent = 'Song library unavailable'; } })();
        })();
