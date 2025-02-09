import { Parser } from "bulletin-board-code";
import { decode } from "html-entities";

function decodeUnicodeEscapes(text: string): string {
  return text.replace(/&#(\d+);|&#x([0-9A-Fa-f]+);/g, (_, dec, hex) => {
    try {
      if (dec) {
        return String.fromCodePoint(parseInt(dec, 10));
      }
      if (hex) {
        return String.fromCodePoint(parseInt(hex, 16));
      }
      return _;
    } catch (error) {
      console.warn('Failed to decode Unicode sequence:', _, error);
      return _;
    }
  });
}

function decodeHTMLEntities(text: string): string {
  return decode(text, { scope: 'strict'});
}

function preprocessText(text: string): string {
  try {
    // Clean and normalize text first
    const cleaned = text.normalize('NFC').trim();
    
    // First decode HTML entities
    const decodedHTML = decodeHTMLEntities(cleaned);
    
    // Then decode any remaining Unicode escapes
    return decodeUnicodeEscapes(decodedHTML);
  } catch (error) {
    console.error('Text preprocessing failed:', error);
    return text;
  }
}

const parser = new Parser();

parser.unsetHandler('url');

parser.setHandler('url', {
    conditions: [{ attribute: { url: null } }],
    bbcode: '[url]{0}[/url]',
    html: (context) => `<a onclick="window.__TAURI__.opener.openUrl('${context.attributes.default}'); return false;" class="external-link">${context.content}</a>`,
    
});

// Box
parser.setHandler('box', {
    bbcode: '[box]{0}[/box]',
    html: '<div class="bb-box">{0}</div>'
});

// Center/Centre
parser.setHandler('center', {
    bbcode: '[center]{0}[/center]',
    html: '<div style="text-align: center;">{0}</div>'
});

parser.setHandler('centre', {
    bbcode: '[centre]{0}[/centre]',
    html: '<div style="text-align: center;">{0}</div>'
});

parser.setHandler('strike', {
    bbcode: '[strike]{0}[/strike]',
    html: '<del>{0}</del>'
})
parser.setHandler('align', {
    conditions: [{ attribute: { align: null } }],
    bbcode: '[align={align}]{0}[/align]',
    html: (context) => `<div style="text-align: ${context.attributes.default || 'left'};">${context.content}</div>`
})
parser.setHandler('spoiler', {
    bbcode: '[spoiler]{0}[/spoiler]',
    html: '<details><summary>Spoiler</summary>{0}</details>'
})

// Float
parser.setHandler('float', {
    conditions: [{ attribute: { direction: null } }],
    bbcode: '[float={direction}]',
    html: (context) => `<div style="float: ${context.attributes.default || 'left'}">${context.content}</div>`
});

// Tab
parser.setHandler('tab', {
    conditions: [
        { attribute: { tab: null } }
    ],
    bbcode: '[tab={tab}]{0}[/tab]',
    html: (context) => `<span style="margin-left: ${context.attributes.default || '20'}px">${context.content}</span>`
});
// Original nation handler
parser.setHandler('nation', {
    bbcode: '[nation]{0}[/nation]',
    html: '<a class="nation-link" href="/nation/{0}">{0}</a>'
});
parser.setHandler('region', {
    bbcode: '[region]{0}[/region]',
    html: '<a class="region-link" href="/region/{0}">{0}</a>'
});

export async function parseBBCode(text: string){
    const processedText = preprocessText(text);
  return parser.toHTML(processedText);
};