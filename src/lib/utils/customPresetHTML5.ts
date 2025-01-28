import { createPreset } from '@bbob/preset';
import { defaultTags, TagNode } from '@bbob/preset-html5/src/defaultTags';
import { TagNodeObject, BBobPluginOptions } from '@bbob/preset';

const customDefaultTags = { ...defaultTags };

// Override URL tag handler
customDefaultTags.url = (node: TagNodeObject, { render }: BBobPluginOptions) => 
    TagNode.create(
        "a",
        {
            class: 'external-link',
            href: 'javascript:void(0)',
            onclick: `(async (e) => { e.preventDefault(); await window.__TAURI__.opener.openUrl('${node.attrs || render(node.content)}'); })(event)`,
        },
        node.content
    );

export default createPreset(customDefaultTags);