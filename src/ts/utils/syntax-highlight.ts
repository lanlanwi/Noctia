import { throwIf } from '../internal';

type TokenRule = {
  type: 'string' | 'comment';
  start: string;
  end: string;
  escape?: string;
};

const RULES: TokenRule[] = [
  {
    type: 'comment',
    start: '/*',
    end: '*/',
  },
  {
    type: 'comment',
    start: '//',
    end: '\n',
  },
  {
    type: 'comment',
    start: '--',
    end: '\n',
  },
  {
    type: 'comment',
    start: '#',
    end: '\n',
  },
  {
    type: 'comment',
    start: '<!--',
    end: '-->',
  },
  {
    type: 'string',
    start: '"',
    end: '"',
    escape: '\\',
  },
  {
    type: 'string',
    start: "'",
    end: "'",
    escape: '\\',
  },
  {
    type: 'string',
    start: '`',
    end: '`',
    escape: '\\',
  },
];

RULES.sort((a, b) => b.start.length - a.start.length);

function findRule(text: string, index: number, rules: TokenRule[]): TokenRule | undefined {
  return rules.find((rule) => text.startsWith(rule.start, index));
}

type Token = {
  type: 'text' | 'string' | 'comment';
  value: string;
};

function readToken(text: string, index: number, rule: TokenRule): Token {
  let end = index + rule.start.length;

  while (end < text.length) {
    if (rule.escape && text.startsWith(rule.escape, end)) {
      end += rule.escape.length + 1;
      continue;
    }

    if (text.startsWith(rule.end, end)) {
      end += rule.end.length;
      break;
    }

    end++;
  }

  return {
    type: rule.type,
    value: text.slice(index, end),
  };
}

function readText(text: string, index: number, rules: TokenRule[]): Token {
  let end = index;

  while (end < text.length) {
    if (findRule(text, end, rules)) break;
    end++;
  }

  return {
    type: 'text',
    value: text.slice(index, end),
  };
}

function parse(text: string, rules: TokenRule[]): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < text.length) {
    const rule = findRule(text, i, rules);

    const token = rule ? readToken(text, i, rule) : readText(text, i, rules);

    if (token.value.length > 0) {
      tokens.push(token);
    }

    i += token.value.length;
  }

  return tokens;
}

function apply(node: Text) {
  const text = node.textContent ?? '';
  const tokens: Token[] = parse(text, RULES);

  const frag = document.createDocumentFragment();

  tokens.forEach((token) => {
    if (token.type === 'text') {
      frag.append(token.value);
      return;
    }

    const span = document.createElement('span');

    span.className = `token-${token.type} syntax-auto`;
    span.textContent = token.value;

    frag.append(span);
  });

  node.replaceWith(frag);
}

export function applySyntaxHighlight(elm: HTMLElement) {
  throwIf(!(elm instanceof HTMLElement), 'applySyntaxHighlight: Expected an HTMLElement.');

  const textNodes: Text[] = [];

  const walker = document.createTreeWalker(elm, NodeFilter.SHOW_TEXT);

  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node instanceof Text) {
      textNodes.push(node);
    }
  }

  textNodes.forEach((textNode) => {
    apply(textNode);
  });
}

export function removeSyntaxHighlight(elm: HTMLElement) {
  throwIf(!(elm instanceof HTMLElement), 'removeSyntaxHighlight: Expected an HTMLElement.');

  const auto = elm.querySelectorAll<HTMLElement>('.syntax-auto');

  auto.forEach((e) => {
    e.replaceWith(e.textContent);
  });
}
