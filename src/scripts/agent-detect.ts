export type AgentClass =
  | 'human'
  | 'agent_browser'
  | 'headless'
  | 'known_bot'
  | 'unknown';

export interface AgentInfo {
  agent_class: AgentClass;
  agent_name: string;
  agent_in_browser: boolean;
}

const BOTS: Array<[string, RegExp]> = [
  ['claudebot', /claudebot|claude-web|anthropic/i],
  ['gptbot', /gptbot/i],
  ['chatgpt-user', /chatgpt-user/i],
  ['perplexity', /perplexity/i],
  ['ccbot', /ccbot/i],
  ['google-extended', /google-extended/i],
  ['bytespider', /bytespider/i],
  ['cohere', /cohere-ai/i],
  ['cursor', /cursor/i],
];

const HEADLESS_RE = /headlesschrome|phantomjs|puppeteer|playwright|selenium/i;

export function classifyAgent(input: {
  userAgent: string;
  webdriver: boolean;
}): AgentInfo {
  const ua = input.userAgent || '';
  let name = 'unknown';
  let cls: AgentClass = 'human';
  let inBrowser = true;

  for (const [n, re] of BOTS) {
    if (re.test(ua)) {
      name = n;
      cls = 'known_bot';
      break;
    }
  }

  if (cls === 'human' && (HEADLESS_RE.test(ua) || input.webdriver === true)) {
    cls = 'headless';
    const m = HEADLESS_RE.exec(ua);
    name = m ? m[0].toLowerCase() : 'webdriver';
    inBrowser = false;
  }

  return { agent_class: cls, agent_name: name, agent_in_browser: inBrowser };
}
