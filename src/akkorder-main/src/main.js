import { Chromagram } from "./Chromagram";
import { ChordDetector } from "./ChordDetector";

export const RootNotes = {
    C : "C",
    CSHARPDFLAT : "C#/Db",
    D : "D",
    DSHARPEFLAT : "D#/Eb",
    E : "E",
    F : "F",
    FSHARPGFLAT : "F#/Gb",
    G : "G",
    GSHARPAFLAT : "G#/Ab",
    A : "A",
    ASHARPBFLAT : "A#/Bb",
    B : "B",
}

const notes = [
    RootNotes.C,
    RootNotes.CSHARPDFLAT,
    RootNotes.D,
    RootNotes.DSHARPEFLAT,
    RootNotes.E,
    RootNotes.F,
    RootNotes.FSHARPGFLAT,
    RootNotes.G,
    RootNotes.GSHARPAFLAT,
    RootNotes.A,
    RootNotes.ASHARPBFLAT,
    RootNotes.B,
];

//type Chord = { rootNote: RootNotes; quality: number; interval: number };

/** Formats a chord by replacing the root note index with the string representation f 
      @param rootNote The root note of the detected chord
      @param sampleRate The quality of the detected chord (Major, Minor, etc)
      @param interval Any other intervals that describe the chord, e.g. 7th
      @returns A chord object
*/
export function prettifyChord(
    rootNote ,
    quality,
    interval
) {
    return { rootNote: notes[rootNote], quality, interval };
}

/** Performs the chord detection algorithm on the array containing the sound data.
    The frame size will be equal to the sampling frequency.
    Number of chords returned will be approximately equal to the number of seconds in the audio track.
      @param audioBuffer Buffer than contains the sound data
      @param sampleRate the sampling frequency
      @returns An array of chords 
*/
export function detectChords(
    audioBuffer,
    sampleRate 
) {
    sampleRate = audioBuffer.sampleRate
    const oneChannelBuffer = audioBuffer.getChannelData(0);
    let chroma_builder = new Chromagram(sampleRate, sampleRate);
    let detector = new ChordDetector();
    let frame = new Array(sampleRate);
    let chords = [];
    let cromas = [];

    //Guarda un acorde por segundo?????
    for (let i = 0; i < oneChannelBuffer.length; i = i + sampleRate) {
        for (let k = 0; k < sampleRate; k++) {
            frame[k] = oneChannelBuffer[i + k];
        }
   
        chroma_builder.processAudioFrame(frame);
       
       

        if (chroma_builder.isReady()) {
            detector.detectChord(chroma_builder.getChromagram());
            console.log(chroma_builder)
            cromas.push(chroma_builder)
            chords.push(
                prettifyChord(
                    detector.rootNote,
                    detector.quality,
                    detector.intervals
                )
            );
        }
    }
    return {"chords":chords,"cromas":cromas}
}

export { ChordDetector, Chromagram };
