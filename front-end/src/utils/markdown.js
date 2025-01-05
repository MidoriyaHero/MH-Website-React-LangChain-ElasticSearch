import { Remarkable } from 'remarkable';
import React from 'react';

/**
 * Function to render a markdown response as HTML.
 * @param {string} markdownText - The response text in markdown format.
 * @returns {JSX.Element} - JSX containing the rendered markdown HTML.
 */
export const renderMarkdownResponse = (markdownText) => {
  const md = new Remarkable({
    breaks: true,  // Convert '\n' to <br>
    typographer: true,  // Enable smart quotes and other typographic replacements
  });

  // Convert markdown text to HTML
  const htmlContent = md.render(markdownText);

  // Return as JSX with modern styling
  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: '1rem',
        lineHeight: '1.6',
        letterSpacing: '0.01em',
        // Modern styling for different elements
        '& h1, & h2, & h3, & h4': {
          fontWeight: '600',
          marginBottom: '0.75em',
          color: '#2D3748',
        },
        '& p': {
          marginBottom: '1em',
        },
        '& a': {
          color: '#4299E1',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
        '& code': {
          backgroundColor: '#EDF2F7',
          padding: '0.2em 0.4em',
          borderRadius: '4px',
          fontSize: '0.9em',
          fontFamily: "'JetBrains Mono', monospace",
        },
        '& pre': {
          backgroundColor: '#2D3748',
          color: '#E2E8F0',
          padding: '1em',
          borderRadius: '8px',
          overflow: 'auto',
          marginBottom: '1em',
        },
        '& ul, & ol': {
          paddingLeft: '1.5em',
          marginBottom: '1em',
        },
        '& li': {
          marginBottom: '0.5em',
        },
        '& blockquote': {
          borderLeft: '4px solid #CBD5E0',
          paddingLeft: '1em',
          marginLeft: '0',
          color: '#4A5568',
          fontStyle: 'italic',
        },
        '& img': {
          maxWidth: '100%',
          borderRadius: '8px',
          marginBottom: '1em',
        },
        '& strong': {
          fontWeight: '600',
          color: '#2D3748',
        },
        '& em': {
          fontStyle: 'italic',
          color: '#4A5568',
        },
      }}
    />
  );
};
