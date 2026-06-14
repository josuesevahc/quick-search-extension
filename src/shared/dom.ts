export function $<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Element not found: ${selector}`);
  return el;
}

export function create(tag: string, props: Record<string, any> = {}, children: (Node | string)[] = []): HTMLElement {
  const el = document.createElement(tag);
  Object.assign(el, props);
  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  });
  return el;
}
