"use client";

import { PortableText, PortableTextBlock } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/utils";
import CodeBlock from "./CodeBlock";

const headingClasses = "font-bold mt-8 mb-3 text-gray-900";

export default function PortableTextRenderer({
  value,
}: {
  value: PortableTextBlock[]; // explicitly typed array of blocks
}) {
  return (

    <PortableText
      value={value}
      components={{
        types: {
          code: ({ value }) => (
            <CodeBlock
              code={value.code}
              language={value.language}
              filename={value.filename}
            />
          ),
          image: ({ value }) => (
            <div className="my-6 flex justify-center">
              <Image
                src={urlFor(value)?.width(800).height(600).url() || ""}
                alt={value.alt || ""}
                width={800}
                height={600}
                className="rounded-lg shadow-sm max-w-full h-auto"
              />
            </div>
          ),
        },
        block: {
          normal: ({ children }) => (
            <p className="mb-6 leading-relaxed text-gray-800">{children}</p>
          ),
          h1: ({ children }) => (
            <h1 className={`text-3xl ${headingClasses}`}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className={`text-2xl ${headingClasses}`}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className={`text-xl ${headingClasses}`}>{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className={`text-lg ${headingClasses}`}>{children}</h4>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 italic pl-5 pr-2 py-3 my-6 bg-gray-50 rounded-r-lg text-gray-600">
              {children}
            </blockquote>
          ),
        },
        list: {
          bullet: ({ children }) => (
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-800">{children}</ul>
          ),
          number: ({ children }) => (
            <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-800">
              {children}
            </ol>
          ),
        },
        listItem: {
          bullet: ({ children }) => (
            <li className="ml-1">{children}</li>
          ),
          number: ({ children }) => (
            <li className="ml-1">{children}</li>
          ),
        },
        marks: {
          link: ({ value, children }) => {
            const target = (value?.href || "").startsWith("http") ? "_blank" : undefined;
            return (
              <a
                href={value?.href}
                target={target}
                rel={target === "_blank" ? "noopener noreferrer" : undefined}
                className="text-blue-600 hover:text-blue-800 underline transition-colors"
              >
                {children}
              </a>
            );
          },
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          underline: ({ children }) => (
            <u className="underline underline-offset-4">{children}</u>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 text-pink-600 px-1.5 py-1 rounded font-mono text-sm">{children}</code>
          ),
        },
      }}
    />
  );
}
