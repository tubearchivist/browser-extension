const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

class FakeElement {
  constructor(tagName = 'div', attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.nodeType = 1;
    this.children = [];
    this.parentElement = null;
    this.attributes = { ...attributes };
    this.dataset = {};
    this.style = {};
    this.offsetWidth = 100;
    this.offsetHeight = 20;
    this.directScans = 0;
    this.classes = new Set();
    this.classList = { add: value => this.classes.add(value) };
  }

  get isConnected() {
    return this.parentElement !== null;
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  addEventListener() {}

  contains(node) {
    return this === node || this.children.some(child => child.contains(node));
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name.startsWith('data-')) {
      this.dataset[name.slice(5)] = String(value);
    }
  }

  matches(selector) {
    return selector.split(',').some(part => {
      const candidate = part.trim();
      if (candidate === '.ta-button') return this.classes.has('ta-button');
      if (candidate === '.ta-channel-button') return this.classes.has('ta-channel-button');
      if (candidate === '#owner') return this.attributes.id === 'owner';
      if (candidate.startsWith('a') && candidate.includes('[href]')) {
        return this.tagName === 'A' && Boolean(this.attributes.href);
      }
      return false;
    });
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (current.matches(selector)) return current;
      current = current.parentElement;
    }
    return null;
  }

  findAll(selector) {
    const matches = [];
    for (const child of this.children) {
      if (child.matches(selector)) matches.push(child);
      matches.push(...child.findAll(selector));
    }
    return matches;
  }

  querySelectorAll(selector) {
    this.directScans += 1;
    return this.findAll(selector);
  }

  querySelector(selector) {
    return this.findAll(selector)[0] ?? null;
  }

  getClientRects() {
    return [{}];
  }

  getBoundingClientRect() {
    return { top: 0, right: 100 };
  }
}

function createHarness() {
  const timers = [];
  const observers = [];
  const body = new FakeElement('body');
  let documentScans = 0;
  const location = {
    href: 'https://www.youtube.com/watch?v=example',
    origin: 'https://www.youtube.com',
    pathname: '/watch',
    search: '?v=example',
  };
  const document = {
    body,
    location,
    createElement: tagName => new FakeElement(tagName),
    querySelectorAll(selector) {
      documentScans += 1;
      return body.findAll(selector);
    },
  };

  class MutationObserver {
    constructor(callback) {
      this.callback = callback;
      observers.push(this);
    }

    observe() {}
  }

  const context = vm.createContext({
    URL,
    URLSearchParams,
    chrome: { runtime: { sendMessage: () => Promise.resolve({}) } },
    clearTimeout() {},
    console: { log() {}, error() {} },
    document,
    getComputedStyle: () => ({
      overflow: 'visible',
      overflowX: 'visible',
      overflowY: 'visible',
      paddingRight: '0',
      position: 'static',
    }),
    MutationObserver,
    setTimeout(callback) {
      timers.push(callback);
      return timers.length;
    },
    window: { location },
  });
  const source = fs.readFileSync(path.join(__dirname, '..', 'extension', 'script.js'), 'utf8');
  vm.runInContext(source, context);

  return {
    body,
    documentScanCount: () => documentScans,
    flushTimers() {
      while (timers.length) timers.shift()();
    },
    observer: observers[0],
  };
}

test('batches overlapping mutation roots and still inserts a button for an existing anchor', () => {
  const harness = createHarness();
  const scansAfterStartup = harness.documentScanCount();
  const itemContainer = new FakeElement('div');
  const anchor = new FakeElement('a', { href: '/watch?v=batched', id: 'video-title' });
  const addedChild = new FakeElement('span');
  anchor.appendChild(addedChild);
  itemContainer.appendChild(anchor);
  harness.body.appendChild(itemContainer);

  harness.observer.callback([{ type: 'childList', target: anchor, addedNodes: [addedChild] }]);
  harness.observer.callback([
    { type: 'childList', target: harness.body, addedNodes: [itemContainer] },
  ]);
  harness.flushTimers();

  assert.equal(
    harness.documentScanCount(),
    scansAfterStartup,
    'mutation work must not rescan the document',
  );
  assert.equal(
    itemContainer.directScans,
    2,
    'the outer root should be scanned once per selector group',
  );
  assert.equal(anchor.directScans, 0, 'the nested root should be collapsed into its ancestor');
  assert.ok(
    itemContainer.children.some(child => child.classes.has('ta-button')),
    'video button should be inserted',
  );
});

test('collapses deeply overlapping roots queued across multiple callbacks', () => {
  const harness = createHarness();
  const scansAfterStartup = harness.documentScanCount();
  const roots = Array.from({ length: 100 }, () => new FakeElement('div'));
  roots.slice(1).forEach((root, index) => roots[index].appendChild(root));
  harness.body.appendChild(roots[0]);

  for (let index = roots.length - 1; index >= 0; index -= 10) {
    const addedNodes = roots.slice(Math.max(0, index - 9), index + 1).reverse();
    harness.observer.callback([{ type: 'childList', target: harness.body, addedNodes }]);
  }
  harness.flushTimers();

  assert.equal(
    harness.documentScanCount(),
    scansAfterStartup,
    'mutation bursts must not rescan the document',
  );
  assert.equal(roots[0].directScans, 2, 'only the outermost queued root should be scanned');
  assert.ok(
    roots.slice(1).every(root => root.directScans === 0),
    'nested roots should not be rescanned',
  );
});
