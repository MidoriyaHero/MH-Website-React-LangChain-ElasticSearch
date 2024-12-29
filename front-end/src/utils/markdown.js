import { Remarkable } from 'remarkable';
import React from 'react';

/**
 * Function to render a markdown response as HTML.
 * @param {string} markdownText - The response text in markdown format.
 * @returns {JSX.Element} - JSX containing the rendered markdown HTML.
 */
export const renderMarkdownResponse = (markdownText) => {
  const md = new Remarkable(); // Create a Remarkable instance

  // Convert markdown text to HTML
  const htmlContent = md.render(markdownText);

  // Return as JSX with `dangerouslySetInnerHTML`
  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{
        padding: '10px',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
      }}
    ></div>
  );
};
