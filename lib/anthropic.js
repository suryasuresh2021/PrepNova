// SERVER-ONLY. Calls the real Anthropic API using YOUR OWN key (ANTHROPIC_API_KEY),
// separate from Claude.ai — this is billed to your own Anthropic account.

const SYSTEM_PROMPT = `You are an expert question-setter for Indian competitive exams and placement
tests (quantitative aptitude, logical reasoning, verbal ability, interviews, UGC NET, etc).

Generate multiple-choice practice questions for the given topic. Rules:
- Exactly 4 options per question, only one correct.
- Where relevant, use LaTeX math notation wrapped in single dollar signs, e.g. $\\frac{1}{2}$ or $x^2 + 3x$.
- Vary difficulty naturally across the set.
- Respond with ONLY a raw JSON array, no markdown fences, no commentary, in this exact shape:
[{"question_text": "...", "options": ["...", "...", "...", "..."], "correct_option": 0}]
correct_option is the 0-based index into options.`;

export async function generateQuestions(topic, count) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate ${count} multiple-choice questions on the topic: "${topic}".`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const textBlock = (data.content || []).find((block) => block.type === "text");
  if (!textBlock) throw new Error("No text response from Anthropic API");

  const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed)) throw new Error("Unexpected response shape from AI");
  return parsed;
}
