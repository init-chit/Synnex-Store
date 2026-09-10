import { useEffect } from 'react';

const replacements = [
  ['NICKYKEY', 'SYNNEX STORE'],
  ['NickyKey', 'Synnex Store'],
  ['GAME STORE CENTER', 'DIGITAL GAME STORE'],
];

export default function BrandingGuard() {
  useEffect(() => {
    const replaceText = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        let value = node.nodeValue;
        replacements.forEach(([from, to]) => { value = value.split(from).join(to); });
        if (value !== node.nodeValue) node.nodeValue = value;
      });
    };

    replaceText();
    const observer = new MutationObserver(replaceText);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
