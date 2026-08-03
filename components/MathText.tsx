"use client";

import { InlineMath, BlockMath } from "react-katex";

// Splits on $$...$$ (block) and $...$ (inline) math delimiters and renders
// each math segment with KaTeX, leaving everything else as plain text.
function parseSegments(text: string) {
  const segments: { type: "text" | "inline" | "block"; content: string }[] = [];
  let remaining = text;
  const pattern = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ type: "block", content: match[1] });
    } else if (match[2] !== undefined) {
      segments.push({ type: "inline", content: match[2] });
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }
  return segments;
}

export default function MathText({ text, className = "" }: { text: string; className?: string }) {
  if (!text) return null;
  const segments = parseSegments(text);

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === "block") {
          try {
            return <BlockMath key={i} math={seg.content} />;
          } catch {
            return <span key={i}>{seg.content}</span>;
          }
        }
        if (seg.type === "inline") {
          try {
            return <InlineMath key={i} math={seg.content} />;
          } catch {
            return <span key={i}>{seg.content}</span>;
          }
        }
        return <span key={i}>{seg.content}</span>;
      })}
    </span>
  );
}
