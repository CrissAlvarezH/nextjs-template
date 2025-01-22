import ReactMarkdown from "react-markdown";


export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
        h4: ({ children }) => <h4 className="text-lg font-bold mb-2">{children}</h4>,
        h5: ({ children }) => <h5 className="text-base font-bold mb-1">{children}</h5>,
        h6: ({ children }) => <h6 className="text-sm font-bold mb-1">{children}</h6>,
        p: ({ children }) => <p className="mb-4">{children}</p>,
        a: ({ children, href }) => (
          <a href={href} className="text-blue-500 hover:text-blue-700 underline">
            {children}
          </a>
        ),
        ul: ({ children }) => <ul className="list-disc list-inside mb-4">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-gray-100 rounded p-4 overflow-x-auto my-4 text-sm font-mono">
            {children}
          </pre>
        ),
        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        hr: () => <hr className="my-8 border-t border-gray-200" />
      }}
    >
      {content}
    </ReactMarkdown>
  )
}