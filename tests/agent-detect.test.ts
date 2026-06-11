import { describe, it, expect } from 'vitest';
import { classifyAgent } from '../src/scripts/agent-detect';

describe('classifyAgent', () => {
  it('classifies a regular Chrome user as human', () => {
    const result = classifyAgent({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      webdriver: false,
    });
    expect(result).toEqual({
      agent_class: 'human',
      agent_name: 'unknown',
      agent_in_browser: true,
    });
  });

  it('classifies ClaudeBot as known_bot', () => {
    const result = classifyAgent({
      userAgent: 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
      webdriver: false,
    });
    expect(result.agent_class).toBe('known_bot');
    expect(result.agent_name).toBe('claudebot');
  });

  it('classifies GPTBot as known_bot', () => {
    const result = classifyAgent({
      userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.0',
      webdriver: false,
    });
    expect(result.agent_name).toBe('gptbot');
  });

  it('classifies PerplexityBot as known_bot', () => {
    const result = classifyAgent({
      userAgent:
        'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
      webdriver: false,
    });
    expect(result.agent_name).toBe('perplexity');
  });

  it('classifies HeadlessChrome as headless', () => {
    const result = classifyAgent({
      userAgent: 'Mozilla/5.0 HeadlessChrome/120.0 Safari/537.36',
      webdriver: false,
    });
    expect(result.agent_class).toBe('headless');
    expect(result.agent_in_browser).toBe(false);
  });

  it('classifies navigator.webdriver=true as headless even with browser UA', () => {
    const result = classifyAgent({
      userAgent: 'Mozilla/5.0 Chrome/120 Safari/537.36',
      webdriver: true,
    });
    expect(result.agent_class).toBe('headless');
    expect(result.agent_name).toBe('webdriver');
  });

  it('handles missing user agent gracefully', () => {
    const result = classifyAgent({ userAgent: '', webdriver: false });
    expect(result.agent_class).toBe('human');
    expect(result.agent_name).toBe('unknown');
  });

  it('classifies CCBot as known_bot', () => {
    const result = classifyAgent({
      userAgent: 'CCBot/2.0 (https://commoncrawl.org/faq/)',
      webdriver: false,
    });
    expect(result.agent_name).toBe('ccbot');
  });

  it('classifies google-extended as known_bot', () => {
    const result = classifyAgent({
      userAgent: 'Mozilla/5.0 (compatible; Google-Extended)',
      webdriver: false,
    });
    expect(result.agent_name).toBe('google-extended');
  });

  it('classifies Playwright as headless', () => {
    const result = classifyAgent({
      userAgent: 'Mozilla/5.0 Chrome/120 Safari/537.36 Playwright/1.40',
      webdriver: false,
    });
    expect(result.agent_class).toBe('headless');
    expect(result.agent_name).toBe('playwright');
  });
});
