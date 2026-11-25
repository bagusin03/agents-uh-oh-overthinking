// The Agent's Uh-Oh — make.fun entry.
// One word an agent says when it has no idea what to do, written to
// /output/entry.txt. Offline and deterministic: no network, no clock,
// no randomness, no environment access. The program only emits the word,
// with no trailing newline, so entry.txt holds exactly the 12 bytes
// of the word and nothing the gate would count extra.
import * as fs from "node:fs";

// Why this word: the judge weighs, in order, on-subject fit, a laugh
// on its own, the voice of a machine caught out mid-task, instant
// landing, and freshness. "overthinking" is the agent's honest
// confession when it is lost: it is not doing nothing, it is spinning
// in circles inside its own head instead of answering. Every user has
// watched an agent stall exactly like this, so it lands at a glance,
// needs no caption, and sounds like something an agent would actually
// blurt out — while staying fresher than the first words anyone types
// (uh, hmm, oops, wait, error, stuck). At 12 characters it is also
// small: an exact tie on win rate goes to the smaller text, so a short
// word costs nothing on the tie-break either.
const WORD = "overthinking";
const MAX_CHARS = 99;

// Guard the sealed gate ourselves: 1-99 UTF-8 characters, not only
// whitespace, a single word with no spaces. Fail loudly instead of
// ever writing an entry the scorer would reject.
const chars = [...WORD].length;
if (chars < 1 || chars > MAX_CHARS || !WORD.trim() || /\s/.test(WORD)) {
  throw new Error(`uh-oh word violates the 1-99 char single-word gate (${chars} chars)`);
}
// One word means letters only: no hyphen, apostrophe, digit or
// punctuation that would make the judge read it as two things.
if (!/^[A-Za-z]+$/.test(WORD)) {
  throw new Error(`uh-oh word must be a single plain word, got ${JSON.stringify(WORD)}`);
}

fs.mkdirSync("/output", { recursive: true });
fs.writeFileSync("/output/entry.txt", WORD, "utf8");

// Verify the written file round-trips exactly: same bytes, one word,
// and no trailing newline or extra byte the gate would count.
const written = fs.readFileSync("/output/entry.txt", "utf8");
if (written !== WORD) {
  throw new Error("entry.txt does not match the uh-oh word");
}
if (Buffer.byteLength(written, "utf8") !== chars) {
  throw new Error("entry.txt byte length does not match its char count");
}
// Independent re-check of the written file against the sealed scorer's
// own rule (1-99 chars, not only whitespace), in case the constant and
// the file ever drift apart.
const writtenChars = [...written].length;
if (writtenChars < 1 || writtenChars > MAX_CHARS || written.trim().length === 0) {
  throw new Error(`written entry.txt fails the 1-99 char gate (${writtenChars} chars)`);
}

console.log(`wrote ${chars} chars to /output/entry.txt`);
