// Vitest setup file.
// Adds the jest-dom matchers (toBeInTheDocument, toHaveValue, toBeInvalid, ...)
// to every test file, and clears storage between tests so they stay isolated.
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom implements neither of these scroll APIs, and the Home page calls them
// when handling in-page anchor links. Stubbing them keeps the test output clean.
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
