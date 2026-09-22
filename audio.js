/**
 * Enhanced Procedural Web Audio API Sound & Multi-Track Synthesizer
 * 100% Procedurally Synthesized - Zero External Audio Files.
 * Includes multiple soundtrack themes, rich drums, basslines, chord pads, and Meloni's Dance Fanfare!
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.masterGain = null;
        this.bgmGain = null;
        this.sfxGain = null;

        this.currentTrackIndex = 0; // 0: Garden Melody, 1: Summit Disco, 2: Cosmic Beat, 3: Meloni Dance
        this.step = 0;
        this.tempo = 100;

        this.trackNames = [
            '🎵 Garden Melody',
            '🎵 Summit Disco',
            '🎵 Cosmic Beat',
            '🎵 Roman Romance'
        ];
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.82;
            this.masterGain.connect(this.ctx.destination);

            this.bgmGain = this.ctx.createGain();
            this.bgmGain.gain.value = 0.38;
            this.bgmGain.connect(this.masterGain);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = 0.7;
            this.sfxGain.connect(this.masterGain);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    cycleMusicTrack() {
        this.init();
        if (this.isMuted) {
            this.isMuted = false;
            this.currentTrackIndex = 0;
            if (this.masterGain) this.masterGain.gain.setTargetAtTime(0.82, this.ctx.currentTime, 0.05);
            this.startBgm(this.currentTrackIndex);
            return this.trackNames[this.currentTrackIndex];
        }

        this.currentTrackIndex++;
        if (this.currentTrackIndex >= this.trackNames.length) {
            // Mute mode
            this.isMuted = true;
            if (this.masterGain) this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
            return '🔇 Muted';
        } else {
            this.startBgm(this.currentTrackIndex);
            return this.trackNames[this.currentTrackIndex];
        }
    }

    setTrackForLevel(levelId) {
        if (this.isMuted) return;
        const trackIdx = (levelId - 1) % this.trackNames.length;
        if (trackIdx !== this.currentTrackIndex || !this.bgmPlaying) {
            this.currentTrackIndex = trackIdx;
            this.startBgm(trackIdx);
        }
    }

    // 1. Kick Drum
    playKick(t, volume = 0.3) {
        if (this.isMuted || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(32, t + 0.12);

        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

        osc.connect(gain);
        gain.connect(this.bgmGain);
        osc.start(t);
        osc.stop(t + 0.16);
    }

    // 2. Snare / Clap
    playSnare(t, volume = 0.18) {
        if (this.isMuted || !this.ctx) return;
        // Tone component
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(70, t + 0.1);
        oscGain.gain.setValueAtTime(volume * 0.8, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(oscGain);
        oscGain.connect(this.bgmGain);
        osc.start(t);
        osc.stop(t + 0.13);

        // Noise snap
        const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.1), this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(volume, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.bgmGain);
        noise.start(t);
    }

    // 3. Hi-Hat
    playHiHat(t, volume = 0.08) {
        if (this.isMuted || !this.ctx) return;
        const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.04), this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 8500;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);
        noise.start(t);
    }

    // 4. Bass Note
    playBass(t, freq, dur, volume = 0.22) {
        if (this.isMuted || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, t);
        filter.frequency.exponentialRampToValueAtTime(150, t + dur);

        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(t);
        osc.stop(t + dur + 0.02);
    }

    // 5. Synth Pluck / Chord note
    playSynthNote(t, freq, dur, volume = 0.12, type = 'sine') {
        if (this.isMuted || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(volume, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(t);
        osc.stop(t + dur + 0.03);
    }

    // Sound FX
    playCollectChime() {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;
        const freqs = [1046.5, 1318.5, 1567.98, 2093.0];
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + idx * 0.04);
            gain.gain.setValueAtTime(0, t + idx * 0.04);
            gain.gain.linearRampToValueAtTime(0.3, t + idx * 0.04 + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.35);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t + idx * 0.04);
            osc.stop(t + idx * 0.04 + 0.36);
        });
    }

    // Floral Rose Pick Chime (Level 4: Lush romantic harp & bell arpeggio)
    playRoseChime() {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;
        const freqs = [880.0, 1108.73, 1318.51, 1661.22, 1760.0, 2217.46]; // A major 9th sparkle
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + idx * 0.035);
            gain.gain.setValueAtTime(0, t + idx * 0.035);
            gain.gain.linearRampToValueAtTime(0.26, t + idx * 0.035 + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.035 + 0.42);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t + idx * 0.035);
            osc.stop(t + idx * 0.035 + 0.43);
        });
    }

    playDisruptBoing() {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(75, t + 0.28);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, t);
        filter.frequency.exponentialRampToValueAtTime(250, t + 0.28);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.3);
    }

    playDistractHeart() {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.linearRampToValueAtTime(660, t + 0.18);
        osc.frequency.linearRampToValueAtTime(330, t + 0.35);

        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 16;
        lfoGain.gain.value = 50;
        lfo.connect(osc.frequency);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        lfo.start(t);
        osc.start(t);
        osc.stop(t + 0.4);
        lfo.stop(t + 0.4);
    }

    playConfettiBlast() {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.15);
        oscGain.gain.setValueAtTime(0.4, t);
        oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(oscGain);
        oscGain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.2);

        const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.25), this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1400, t);
        noiseFilter.Q.value = 2.0;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.sfxGain);
        noise.start(t);
    }

    playPresentGift() {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;
        const chord = [523.25, 659.25, 783.99, 1046.5];
        chord.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + i * 0.05);
            gain.gain.setValueAtTime(0, t + i * 0.05);
            gain.gain.linearRampToValueAtTime(0.25, t + i * 0.05 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.4);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t + i * 0.05);
            osc.stop(t + i * 0.05 + 0.42);
        });
    }

    playJump() {
        if (this.isMuted) return;
        this.init();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, t);
        osc.frequency.exponentialRampToValueAtTime(480, t + 0.15);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.17);
    }

    // Meloni's 100% Celebration Dance Tune (Cheerful, Joyful Italian/Pop Dance Fanfare!)
    playDanceTune() {
        if (this.isMuted) return;
        this.init();
        this.stopBgm();
        const t = this.ctx.currentTime;

        // Joyful dance fanfare melody (C - E - G - A - C - D - E with bouncy syncopation)
        const danceMelody = [
            { f: 523.25, d: 0.14, dt: 0.0 },
            { f: 659.25, d: 0.14, dt: 0.14 },
            { f: 783.99, d: 0.14, dt: 0.28 },
            { f: 880.00, d: 0.20, dt: 0.42 },
            { f: 783.99, d: 0.14, dt: 0.62 },
            { f: 1046.5, d: 0.35, dt: 0.76 },
            // Second phrase
            { f: 880.00, d: 0.14, dt: 1.15 },
            { f: 1046.5, d: 0.14, dt: 1.29 },
            { f: 1174.6, d: 0.18, dt: 1.43 },
            { f: 1318.5, d: 0.40, dt: 1.62 },
            // Bouncy rhythm repeat
            { f: 1046.5, d: 0.12, dt: 2.05 },
            { f: 1174.6, d: 0.12, dt: 2.18 },
            { f: 1318.5, d: 0.14, dt: 2.31 },
            { f: 1567.9, d: 0.50, dt: 2.46 }
        ];

        danceMelody.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, t + note.dt);

            gain.gain.setValueAtTime(0, t + note.dt);
            gain.gain.linearRampToValueAtTime(0.3, t + note.dt + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + note.dt + note.d);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t + note.dt);
            osc.stop(t + note.dt + note.d + 0.05);
        });

        // Add happy dance drum taps during celebration
        for (let i = 0; i < 16; i++) {
            const drumT = t + i * 0.18;
            if (i % 2 === 0) this.playKick(drumT, 0.25);
            else this.playSnare(drumT, 0.15);
            this.playHiHat(drumT + 0.09, 0.08);
        }
    }

    playLevelWin() {
        this.playDanceTune();
    }

    // ==========================================
    // Multi-Track Background Music Synthesizer
    // ==========================================
    startBgm(trackIndex = 0) {
        this.init();
        this.stopBgm();
        this.bgmPlaying = true;
        this.currentTrackIndex = trackIndex;
        this.step = 0;

        // Theme 1: "Garden Melody" (Level 1) - Cheerful, warm pop groove (BPM: 104)
        // Theme 2: "Summit Disco" (Level 2) - Funky walking bass, 4-on-the-floor (BPM: 112)
        // Theme 3: "Cosmic Beat" (Level 3) - High-energy synthwave rolling pulse (BPM: 120)
        // Theme 4: "Roman Romance" (Level 4) - Romantic Italian pop waltz groove (BPM: 108)

        const tempos = [104, 112, 120, 108];
        this.tempo = tempos[trackIndex % tempos.length];
        const stepSec = (60 / this.tempo) / 4; // 16th note step

        const chordsTrack1 = [
            { bass: 130.81, chords: [261.63, 329.63, 392.0, 493.88] }, // Cmaj7
            { bass: 174.61, chords: [349.23, 440.0, 523.25, 659.25] }, // Fmaj7
            { bass: 146.83, chords: [293.66, 349.23, 440.0, 523.25] }, // Dm7
            { bass: 196.00, chords: [392.0, 493.88, 587.33, 698.46] }  // G7
        ];

        const chordsTrack2 = [
            { bass: 146.83, chords: [293.66, 349.23, 440.0, 523.25] }, // Dm7
            { bass: 164.81, chords: [329.63, 392.0, 493.88, 587.33] }, // Em7
            { bass: 174.61, chords: [349.23, 440.0, 523.25, 659.25] }, // Fmaj7
            { bass: 196.00, chords: [392.0, 440.0, 493.88, 587.33] }   // Gsus
        ];

        const chordsTrack3 = [
            { bass: 110.00, chords: [220.0, 261.63, 329.63, 440.0] },  // Am
            { bass: 174.61, chords: [349.23, 440.0, 523.25, 659.25] }, // F
            { bass: 130.81, chords: [261.63, 329.63, 392.0, 523.25] }, // C
            { bass: 196.00, chords: [392.0, 493.88, 587.33, 783.99] }  // G
        ];

        const chordsTrack4 = [
            { bass: 174.61, chords: [349.23, 440.0, 523.25, 659.25] }, // Fmaj7 (Romantic Rose)
            { bass: 130.81, chords: [261.63, 329.63, 392.0, 493.88] }, // Cmaj7
            { bass: 146.83, chords: [293.66, 349.23, 440.0, 523.25] }, // Dm7
            { bass: 196.00, chords: [392.0, 493.88, 587.33, 698.46] }  // G7
        ];

        const allChordSets = [chordsTrack1, chordsTrack2, chordsTrack3, chordsTrack4];
        const currentChordSet = allChordSets[trackIndex % allChordSets.length];

        const scheduleStep = () => {
            if (!this.bgmPlaying || !this.ctx) return;
            const t = this.ctx.currentTime;
            const barIndex = Math.floor(this.step / 16) % currentChordSet.length;
            const beatInBar = this.step % 16;
            const currentChord = currentChordSet[barIndex];

            // 1. Drum Rhythm
            if (trackIndex === 0) {
                // Garden Groove
                if (beatInBar === 0 || beatInBar === 8) this.playKick(t, 0.28);
                if (beatInBar === 4 || beatInBar === 12) this.playSnare(t, 0.16);
                if (beatInBar % 2 === 0) this.playHiHat(t, 0.06);
            } else if (trackIndex === 1) {
                // Summit Disco
                if (beatInBar % 4 === 0) this.playKick(t, 0.32);
                if (beatInBar === 4 || beatInBar === 12) this.playSnare(t, 0.18);
                if (beatInBar % 4 === 2) this.playHiHat(t, 0.09);
            } else if (trackIndex === 2) {
                // Cosmic Beat
                if (beatInBar % 4 === 0 || beatInBar === 10) this.playKick(t, 0.35);
                if (beatInBar === 4 || beatInBar === 12) this.playSnare(t, 0.2);
                this.playHiHat(t, beatInBar % 2 === 0 ? 0.08 : 0.04);
            } else {
                // Roman Romance (Romantic Italian Waltz Pop)
                if (beatInBar === 0 || beatInBar === 8) this.playKick(t, 0.26);
                if (beatInBar === 4 || beatInBar === 12) this.playSnare(t, 0.14);
                if (beatInBar % 2 === 0) this.playHiHat(t, 0.07);
            }

            // 2. Bassline
            if (beatInBar === 0 || beatInBar === 6 || beatInBar === 10 || beatInBar === 14) {
                const bassFreq = beatInBar === 6 ? currentChord.bass * 1.5 : currentChord.bass;
                this.playBass(t, bassFreq, stepSec * 2.2, 0.22);
            }

            // 3. Chord Pads (Strum on beat 0 and beat 8)
            if (beatInBar === 0 || beatInBar === 8) {
                currentChord.chords.forEach((freq, idx) => {
                    this.playSynthNote(t + idx * 0.02, freq, stepSec * 7, 0.08, 'sine');
                });
            }

            // 4. Arpeggiated Melody Lead
            const leadNotes = currentChord.chords;
            if (beatInBar % 2 === 0) {
                const noteIdx = (beatInBar / 2) % leadNotes.length;
                const leadFreq = leadNotes[noteIdx] * (trackIndex === 2 ? 1.5 : 1.0);
                this.playSynthNote(t, leadFreq, stepSec * 1.6, 0.09, 'triangle');
            }

            this.step++;
            this.bgmTimer = setTimeout(scheduleStep, stepSec * 1000);
        };

        scheduleStep();
    }

    stopBgm() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

const sound = new SoundEngine();
