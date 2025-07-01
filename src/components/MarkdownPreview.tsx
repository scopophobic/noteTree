// components/MarkdownPreview.tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const sample = `
# Heading One

## Heading Two

This is **bold**, this is *italic*.

- List item 1
- List item 2

> This is a quote
`;

export default function MarkdownPreview() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="prose max-w-none bg-white p-6 rounded shadow">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {sample}
        </ReactMarkdown>
      </div>
    </div>
  );
}

