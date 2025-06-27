// This library will be used to postprocess the content field of a content object.
// For now, it just returns the input unchanged.

// Helper to parse attributes from a tag string
function parseAttributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRegex = /(\w+)="([^"]*)"/g;
  let match;
  while ((match = attrRegex.exec(tag))) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

export function postprocessContent(content: string): string {
  // Handle [blockquote]...[/blockquote]
  content = content.replace(
    /\[blockquote\]([\s\S]*?)\[\/blockquote\]/gi,
    (_, inner) => `<blockquote style="background:#fff9c4;border-radius:8px;padding:16px;">${inner.trim()}</blockquote>`
  );

  // Handle [collapsible ...attributes]...[/collapsible]
  let collapsibleIndex = 0;
  content = content.replace(
    /\[collapsible([^\]]*)\]([\s\S]*?)\[\/collapsible\]/gi,
    (match, attrStr, inner) => {
      const attrs = parseAttributes(attrStr);
      const title = attrs.title || 'Details';
      const idx = collapsibleIndex++;
      return `
        <div class="collapsible" data-collapsible-idx="${idx}" style="border:1px solid #eee;border-radius:8px;">
          <div class="collapsible-header" style="display:flex;align-items:center;cursor:pointer;padding:0px 8px 0px 0px;user-select:none;" onclick="(function(e){var b=document.querySelector('[data-collapsible-body-idx=\\'${idx}\\']');var a=e.currentTarget.querySelector('.collapsible-arrow');if(b.style.display==='none'){b.style.display='block';a.style.transform='rotate(90deg)';}else{b.style.display='none';a.style.transform='rotate(0deg)';}})(event)">
            <span class="collapsible-arrow" style="display:inline-block;transition:transform 0.2s;transform:rotate(0deg);margin-right:8px;">&#9654;</span>
            <span>${title}</span>
          </div>
          <div class="collapsible-body" data-collapsible-body-idx="${idx}" style="display:none;">${inner.trim()}</div>
        </div>
      `;
    }
  );

  // Handle [list]...[/list] and [list-item ...]...[/list-item]
  content = content.replace(
    /\[list\]([\s\S]*?)\[\/list\]/gi,
    (_, listInner) => {
      // Replace all [list-item ...]...[/list-item] inside this list
      const items = [];
      let itemMatch;
      const itemRegex = /\[list-item([^\]]*)\]([\s\S]*?)\[\/list-item\]/gi;
      while ((itemMatch = itemRegex.exec(listInner))) {
        const attrs = parseAttributes(itemMatch[1]);
        const icon = attrs.icon || '';
        const text = itemMatch[2].trim();
        // Render icon as a span with a data attribute for later React replacement
        items.push(`<div class="list-item" style="display:flex;align-items:center;gap:8px;"><span class="mui-icon" data-icon-name="${icon}" style="display:inline-flex;align-items:center;"></span><span>${text}</span></div>`);
      }
      return `<div class="dsl-list">${items.join('')}</div>`;
    }
  );

  return content;
}
