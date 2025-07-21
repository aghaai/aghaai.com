"use client";

import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/utils";
import CodeBlock from "./CodeBlock";

const headingClasses =
  "text-2xl font-semibold text-accent-foreground mt-8 mb-4";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PortableTextRenderer({ value }: { value: any }) {
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
            <div className="my-6">
              <Image
                src={urlFor(value)?.width(800).height(600).url() || ""}
                alt={value.alt || ""}
                width={800}
                height={600}
                className="rounded-md"
              />
            </div>
          ),
        },
        block: {
            normal: ({ children }) => (
              <span className="mb-6 text-accent-foreground leading-relaxed">
                {children}
              </span>
            ),
            h1: ({ children }) => (
              <h1 className={`text-3xl ${headingClasses}`}>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className={`text-3xl ${headingClasses}`}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className={`text-2xl ${headingClasses}`}>{children}</h3>
            ),
            h4: ({ children }) => (
              <h3 className={`text-xl ${headingClasses}`}>{children}</h3>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 italic pl-6 py-2 my-6 bg-gray-100 rounded-r-lg">
                {children}
              </blockquote>
            ),
          },
          list: {
            bullet: ({ children }) => (
              <ul className="list-disc pl-4 mb-6 space-y-2">{children}</ul>
            ),
            number: ({ children }) => (
              <ol className="list-decimal pl-4 mb-6 space-y-2">
                {children}
              </ol>
            ),
          },
          listItem: {
            bullet: ({ children }) => (
              <li className="text-accent-foreground">{children}</li>
            ),
            number: ({ children }) => (
              <li className="text-accent-foreground">{children}</li>
            ),
          },
          marks: {
            link: ({ value, children }) => {
              const target = (value?.href || "").startsWith("http")
                ? "_blank"
                : undefined;
              return (
                <a
                  href={value?.href}
                  target={target}
                  rel={
                    target === "_blank" ? "noopener noreferrer" : undefined
                  }
                  className="text-blue-500 hover:text-blue-600 underline transition-colors"
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
              <div className="w-full py-5 px-3 my-6 bg-accent rounded-md">
                {children}
              </div>
            ),
          },
      }}
    />
  );
}
