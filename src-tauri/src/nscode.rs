use std::collections::HashMap;
use lazy_static::lazy_static;
use regex::Regex;

// ============= TAG HANDLER TYPES =============
#[derive(Debug, Clone)]
pub enum TagHandler {
    Simple(String),                    // For basic text replacement
    Custom(fn(&TagAttributes) -> String), // For complex logic
    List,                             // Special handler for lists
    Table,                            // Special handler for tables
}

#[derive(Debug)]
pub struct TagAttributes {
    pub content: String,
    pub named_attrs: HashMap<String, String>,
    pub default_attr: Option<String>,
}

pub struct BBCodeParser {
    tags: HashMap<String, TagHandler>,
}

impl BBCodeParser {
    pub fn new() -> Self {
        let mut parser = Self {
            tags: HashMap::new(),
        };
        
        // ============= DEFAULT TAGS =============
        // Basic formatting tags
        parser.add_simple_tag("b", "<strong>$content</strong>");
        parser.add_simple_tag("i", "<em>$content</em>");
        parser.add_simple_tag("u", "<u>$content</u>");
        parser.add_simple_tag("s", "<strike>$content</strike>");
        
        // Add line break conversion
        parser.add_single_tag("br", "<br>");
        
        // Add image tag
        parser.add_custom_tag("img", |attrs| {
            let src = match &attrs.default_attr {
                Some(url) => url,
                None => &attrs.content
            };
            format!("<img src=\"{}\" alt=\"{}\">", src, attrs.content)
        });
        
        // Color tag with attribute support
        parser.add_custom_tag("color", |attrs| {
            let default_color = "#000000".to_string();
            let color = attrs.default_attr.as_ref()
                .or_else(|| attrs.named_attrs.get("color"))
                .unwrap_or(&default_color);
            format!("<span style=\"color: {}\">{}</span>", color, attrs.content)
        });
        
        // URL tag with attribute support
        parser.add_custom_tag("url", |attrs| {
            let href = attrs.default_attr.as_ref()
                .or_else(|| attrs.named_attrs.get("href"))
                .unwrap_or(&attrs.content);
            format!("<a href=\"{}\">{}</a>", href, attrs.content)
        });
        
        // Special handlers
        parser.tags.insert("list".to_string(), TagHandler::List);
        parser.tags.insert("table".to_string(), TagHandler::Table);
        
        // Add box tag
        parser.add_simple_tag("box", "<div class=\"bb-box\">$content</div>");
        
        // Add center/centre tags (both spellings)
        parser.add_simple_tag("center", "<div style=\"text-align: center;\">$content</div>");
        parser.add_simple_tag("centre", "<div style=\"text-align: center;\">$content</div>");
        
        // Add float tag with attribute support
        parser.add_custom_tag("float", |attrs| {
            let direction = attrs.default_attr.as_ref()
                .map(|d| d.to_lowercase())
                .unwrap_or_else(|| "left".to_string());
            format!("<div style=\"float: {};\">{}</div>", direction, attrs.content)
        });
        
        // Add tab tag with pixel spacing
        parser.add_custom_tag("tab", |attrs| {
            let pixels = attrs.default_attr.as_ref()
                .and_then(|s| s.parse::<u32>().ok())
                .unwrap_or(50);
            format!("<span style=\"margin-left: {}px;\">{}</span>", pixels, attrs.content)
        });

        parser
    }

    // ============= CUSTOM TAG ADDITION METHODS =============
    
    /// Add a simple tag with direct HTML replacement
    /// Example: parser.add_simple_tag("mybox", "<div class=\"mybox\">$content</div>");
    pub fn add_simple_tag(&mut self, name: &str, template: &str) {
        self.tags.insert(
            name.to_string(),
            TagHandler::Simple(template.to_string())
        );
    }
    
    /// Add a custom tag with complex logic
    /// Example:
    /// ```rust
    /// parser.add_custom_tag("size", |attrs| {
    ///     let size = attrs.default_attr.unwrap_or("12".to_string());
    ///     format!("<span style=\"font-size: {}px\">{}</span>", size, attrs.content)
    /// });
    /// ```
    pub fn add_custom_tag(&mut self, name: &str, handler: fn(&TagAttributes) -> String) {
        self.tags.insert(name.to_string(), TagHandler::Custom(handler));
    }

    // Add new method for single tags
    pub fn add_single_tag(&mut self, name: &str, html: &str) {
        self.tags.insert(
            name.to_string(),
            TagHandler::Simple(html.to_string())
        );
    }

    pub fn parse(&self, input: &str) -> String {
        // First convert line breaks to [br] tags
        let with_brs = input
            .replace("\r\n", "[br]")
            .replace("\n", "[br]");

        // Process in order: tables -> lists -> other tags
        let with_tables = self.process_tables(&with_brs);
        let with_lists = self.process_lists(&with_tables);
        self.process_tags(&with_lists)
    }

    // ============= TABLE PROCESSING =============
    fn process_tables(&self, input: &str) -> String {
        lazy_static! {
            static ref TABLE_RE: Regex = Regex::new(r"(?is)\[table\](.*?)\[/table\]").unwrap();
            static ref ROW_RE: Regex = Regex::new(r"(?is)\[tr\](.*?)\[/tr\]").unwrap();
            static ref HEADER_RE: Regex = Regex::new(r"(?is)\[th\](.*?)\[/th\]").unwrap();
            static ref CELL_RE: Regex = Regex::new(r"(?is)\[td\](.*?)\[/td\]").unwrap();
        }

        let mut result = input.to_string();
        while TABLE_RE.is_match(&result) {
            result = TABLE_RE.replace_all(&result, |table_caps: &regex::Captures| {
                let table_content = table_caps.get(1).map(|m| m.as_str()).unwrap_or("");
                let mut table_html = String::from("<table class=\"bb-table\">\n");
                
                // Process rows
                for row_match in ROW_RE.captures_iter(table_content) {
                    let row_content = row_match.get(1).map(|m| m.as_str()).unwrap_or("");
                    table_html.push_str("<tr>\n");
                    
                    // Process headers in this row
                    let row_with_headers = HEADER_RE.replace_all(row_content, |cell_caps: &regex::Captures| {
                        let cell_content = cell_caps.get(1).map(|m| m.as_str()).unwrap_or("");
                        format!("<th>{}</th>\n", self.process_tags(cell_content))
                    });
                    
                    // Process regular cells
                    let row_with_cells = CELL_RE.replace_all(&row_with_headers, |cell_caps: &regex::Captures| {
                        let cell_content = cell_caps.get(1).map(|m| m.as_str()).unwrap_or("");
                        format!("<td><p>{}<p></td>\n", self.process_tags(cell_content))
                    });
                    
                    table_html.push_str(&row_with_cells);
                    table_html.push_str("</tr>\n");
                }
                
                table_html.push_str("</table>");
                table_html
            }).to_string();
        }
        
        result
    }

    // ============= LIST PROCESSING =============
    fn process_lists(&self, input: &str) -> String {
        lazy_static! {
            static ref LIST_RE: Regex = Regex::new(r"(?s)\[list(?:=(1|a|A|i|I))?\](.*?)\[/list\]").unwrap();
        }

        let mut result = input.to_string();

        while LIST_RE.is_match(&result) {
            result = LIST_RE.replace_all(&result, |caps: &regex::Captures| {
                let list_type = caps.get(1).map(|m| m.as_str());
                let content = caps.get(2).map(|m| m.as_str()).unwrap_or("");
                
                // First, extract all [*] items from this level
                let mut items = Vec::new();
                let mut current_pos = 0;
                let mut in_nested_list = false;
                let mut current_item = String::new();
                
                while let Some(start) = content[current_pos..].find("[*]") {
                    let real_start = current_pos + start;
                    
                    // Check if we're inside a nested list
                    if !in_nested_list {
                        // If we have content from previous item, save it
                        if !current_item.is_empty() {
                            items.push(current_item.trim().to_string());
                            current_item = String::new();
                        }
                        current_pos = real_start + 3; // Skip [*]
                    }

                    // Process character by character
                    while current_pos < content.len() {
                        let c = &content[current_pos..current_pos + 1];
                        if c == "[" {
                            if content[current_pos..].starts_with("[list") {
                                in_nested_list = true;
                            } else if content[current_pos..].starts_with("[/list]") {
                                in_nested_list = false;
                            }
                        }
                        
                        current_item.push_str(c);
                        current_pos += 1;

                        if !in_nested_list && (content[current_pos..].starts_with("[*]") || current_pos >= content.len()) {
                            break;
                        }
                    }
                }
                
                // Add the last item
                if !current_item.is_empty() {
                    items.push(current_item.trim().to_string());
                }

                // Process each item's content recursively
                let processed_items: String = items.iter()
                    .map(|item| {
                        let processed = self.process_lists(item);
                        format!("<li>{}</li>", self.process_tags(&processed))
                    })
                    .collect();

                // Handle list type
                let tag = match list_type {
                    Some("1") => "ol type=\"1\"",
                    Some("a") => "ol type=\"a\"",
                    Some("A") => "ol type=\"A\"",
                    Some("i") => "ol type=\"i\"",
                    Some("I") => "ol type=\"I\"",
                    _ => "ul"
                };

                format!("<{}>{}</{}>\n", tag, processed_items, tag.split_whitespace().next().unwrap())
            }).to_string();
        }
        
        result
    }

    // ============= GENERAL TAG PROCESSING =============
    fn process_tags(&self, input: &str) -> String {
        let mut result = input.to_string();
        
        for (tag_name, handler) in &self.tags {
            match handler {
                TagHandler::Simple(template) => {
                    // Handle both paired and single tags
                    let patterns = vec![
                        // Paired tags with content
                        format!(r"(?i)\[{}\](.*?)\[/{}\]", tag_name, tag_name),
                        format!(r"(?i)\[{}=([^\]]+)\](.*?)\[/{}\]", tag_name, tag_name),
                        // Single tags without content
                        format!(r"(?i)\[{}\]", tag_name),
                    ];
                    
                    for pattern in patterns {
                        let re = Regex::new(&pattern).unwrap();
                        result = re.replace_all(&result, |caps: &regex::Captures| {
                            if caps.len() == 1 {
                                // Single tag with no content
                                template.to_string()
                            } else {
                                let content = caps.get(caps.len() - 1).map(|m| m.as_str()).unwrap_or("");
                                let processed_content = self.process_tags(content);
                                if caps.len() > 2 {
                                    template.replace("$content", &processed_content)
                                           .replace("$attr", &caps[1])
                                } else {
                                    template.replace("$content", &processed_content)
                                }
                            }
                        }).to_string();
                    }
                }
                
                TagHandler::Custom(handler_fn) => {
                    // Process custom tags with complex logic, case insensitive
                    let patterns = vec![
                        format!(r"(?i)\[{}\](.*?)\[/{}\]", tag_name, tag_name),
                        format!(r"(?i)\[{}=([^\]]+)\](.*?)\[/{}\]", tag_name, tag_name),
                        format!(r"(?i)\[{}\s+([^]]+)\](.*?)\[/{}\]", tag_name, tag_name),
                    ];
                    
                    for pattern in patterns {
                        let re = Regex::new(&pattern).unwrap();
                        result = re.replace_all(&result, |caps: &regex::Captures| {
                            let content = caps.get(caps.len() - 1).map(|m| m.as_str()).unwrap_or("");
                            let processed_content = self.process_tags(content);
                            let attrs = TagAttributes {
                                content: processed_content,
                                named_attrs: self.parse_named_attributes(caps.get(1).map(|m| m.as_str()).unwrap_or("")),
                                default_attr: caps.get(1).map(|m| m.as_str().to_string()),
                            };
                            handler_fn(&attrs)
                        }).to_string();
                    }
                }
                
                TagHandler::List | TagHandler::Table => continue, // Handled separately
            }
        }
        
        result
    }

    fn parse_named_attributes(&self, attr_str: &str) -> HashMap<String, String> {
        lazy_static! {
            static ref ATTR_RE: Regex = Regex::new(r#"([a-zA-Z0-9_-]+)\s*=\s*"([^"]*)"#).unwrap();
        }
        
        let mut attrs = HashMap::new();
        for cap in ATTR_RE.captures_iter(attr_str) {
            if cap.len() >= 3 {
                attrs.insert(cap[1].to_string(), cap[2].to_string());
            }
        }
        attrs
    }
}

// Example usage and tests
fn test_parser() {
    let parser = BBCodeParser::new();
    
    // Test cases
    let tests = vec![
        // Table test
        (
            "[table][tr][th]Header 1[/th][th]Header 2[/th][/tr][tr][td]Cell 1[/td][td]Cell 2[/td][/tr][/table]",
            "<table class=\"bbcode-table\">\n<tr>\n<th>Header 1</th>\n<th>Header 2</th>\n</tr>\n<tr>\n<td>Cell 1</td>\n<td>Cell 2</td>\n</tr>\n</table>"
        ),
        
        // Nested table test
        (
            "[table][tr][td]Simple cell[/td][td][table][tr][td]Nested cell[/td][/tr][/table][/td][/tr][/table]",
            "<table class=\"bbcode-table\">\n<tr>\n<td>Simple cell</td>\n<td><table class=\"bbcode-table\">\n<tr>\n<td>Nested cell</td>\n</tr>\n</table></td>\n</tr>\n</table>"
        ),
        
        // Table with formatted content
        (
            "[table][tr][td][b]Bold[/b] cell[/td][td][color=#FF0000]Red[/color] cell[/td][/tr][/table]",
            "<table class=\"bbcode-table\">\n<tr>\n<td><strong>Bold</strong> cell</td>\n<td><span style=\"color: #FF0000\">Red</span> cell</td>\n</tr>\n</table>"
        ),
        
        // New test cases for the added tags
        (
            "[center]Centered text[/center]",
            "<div style=\"text-align: center;\">Centered text</div>"
        ),
        (
            "[box]Boxed content[/box]",
            "<div class=\"bb-box\">Boxed content</div>"
        ),
        (
            "[float=right]Right floating text[/float]",
            "<div style=\"float: right;\">Right floating text</div>"
        ),
        (
            "[tab=100]Indented text[/tab]",
            "<span style=\"margin-left: 100px;\">Indented text</span>"
        ),
    ];

    for (input, expected) in tests {
        let result = parser.parse(input);
        assert_eq!(result, expected);
    }
}