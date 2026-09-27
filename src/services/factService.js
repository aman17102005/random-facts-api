const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'facts.json');

/**
 * Facts are loaded once into memory at startup. This keeps the API fast
 * and requires no database for the initial version. Swapping this file
 * for a real DB-backed implementation later only means changing this
 * module — the routes/controllers don't need to know where data lives.
 */
let facts = [];

function loadFacts() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('facts.json must contain an array of fact objects');
  }

  facts = parsed;
}

// Load immediately when this module is first required.
loadFacts();

function getAllCategories() {
  const set = new Set(facts.map((f) => f.category));
  return Array.from(set).sort();
}

function isValidCategory(category) {
  return getAllCategories().includes(category.toLowerCase());
}

function getRandomFact(category) {
  const pool = category
    ? facts.filter((f) => f.category === category.toLowerCase())
    : facts;

  if (pool.length === 0) return null;

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

function getRandomFacts(limit, category) {
  const pool = category
    ? facts.filter((f) => f.category === category.toLowerCase())
    : facts;

  if (pool.length === 0) return [];

  // Shuffle a shallow copy (Fisher-Yates) then take the first `limit`.
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(limit, shuffled.length));
}

/**
 * Deterministic "fact of the day": the same fact is returned all day for
 * everyone, and changes at UTC midnight. It's deterministic because it's
 * derived from the day's date rather than Math.random().
 */
function getFactOfTheDay(date = new Date()) {
  if (facts.length === 0) return null;

  const dayString = date.toISOString().slice(0, 10); // e.g. "2026-09-27"
  let hash = 0;
  for (let i = 0; i < dayString.length; i++) {
    hash = (hash * 31 + dayString.charCodeAt(i)) >>> 0;
  }

  const index = hash % facts.length;
  return { ...facts[index], date: dayString };
}

function getFactCount() {
  return facts.length;
}

module.exports = {
  loadFacts,
  getAllCategories,
  isValidCategory,
  getRandomFact,
  getRandomFacts,
  getFactOfTheDay,
  getFactCount,
};
