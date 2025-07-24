"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ code, language = "javascript", filename }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="relative my-6 group">
      {filename && (
        <div className="absolute top-2 left-4 text-xs text-gray-400 font-mono">{filename}</div>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-3 py-1 rounded transition-all hover:bg-gray-700 z-10"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <SyntaxHighlighter
        language={language}
        style={coldarkDark}
        customStyle={{
          padding: "1.1rem 1rem 1rem 1rem",
          borderRadius: "0.7rem",
          fontSize: "0.93rem",
          margin: 0,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
