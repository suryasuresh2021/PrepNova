const EXCELLENT = [
  { emoji: "🎉", message: "Excellent work! You're clearly on top of this topic." },
  { emoji: "🚀", message: "Outstanding! That's the kind of score that gets interview calls." },
  { emoji: "🏆", message: "Top marks! Keep this up and the real exam won't stand a chance." },
  { emoji: "🔥", message: "You're on fire! This topic is basically yours now." },
];

const GOOD = [
  { emoji: "👍", message: "Good effort! A little more practice and you'll be acing these." },
  { emoji: "💪", message: "Solid attempt — you clearly know the basics, just sharpen the edges." },
  { emoji: "📈", message: "You're getting there! Review the ones you missed and try again." },
  { emoji: "✨", message: "Nice work overall — a couple more rounds and this topic is locked in." },
];

const NEEDS_IMPROVEMENT = [
  { emoji: "😅", message: "Everyone starts somewhere — let's hit the books again on this one." },
  { emoji: "🧐", message: "Rough round, but every wrong answer is basically a study note now." },
  { emoji: "☕", message: "Time for a coffee break and a second attempt — you've got this." },
  { emoji: "🐢", message: "Slow and steady! Review the explanations below and try this topic again soon." },
];

export function getResultMessage(percent) {
  const pool = percent >= 80 ? EXCELLENT : percent >= 50 ? GOOD : NEEDS_IMPROVEMENT;
  return pool[Math.floor(Math.random() * pool.length)];
}
