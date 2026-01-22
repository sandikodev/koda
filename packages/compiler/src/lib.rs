use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
#[serde(tag = "type")]
pub enum ZenithNode {
    Container {
        name: String,
        properties: Vec<Property>,
        children: Vec<ZenithNode>,
        #[serde(default)]
        class_name: String,
    },
    Leaf {
        name: String,
        properties: Vec<Property>,
        #[serde(default)]
        class_name: String,
    },
    TextLiteral {
        value: String,
    },
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct Property {
    pub name: String,
    pub value: String,
}

#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub struct CompilerResult {
    pub ast: Option<ZenithNode>,
    pub code: String,
    pub css: String,
}

/// Core Compilation Logic
pub fn compile_logic(input: &str) -> CompilerResult {
    let mut parser = Parser::new(input);
    let mut ast = parser.parse();
    
    let mut css_collector = HashSet::new();
    transform_and_extract_css(&mut ast, &mut css_collector);
    
    let css = css_collector.into_iter()
        .map(|rule| rule)
        .collect::<Vec<String>>()
        .join("\n");

    CompilerResult {
        ast: Some(ast),
        code: "// Zenith Generated Logic".to_string(),
        css,
    }
}

/// Recursive AST Transformation & CSS Extraction
fn transform_and_extract_css(node: &mut ZenithNode, collector: &mut HashSet<String>) {
    match node {
        ZenithNode::Container { properties, children, class_name, .. } => {
            let mut classes = Vec::new();
            for prop in properties {
                if is_style_prop(&prop.name) {
                    let class = format!("{}-{}", prop.name, prop.value.replace("'", "").replace("\"", ""));
                    let rule = format!(".{} {{ {}: {}; }}", class, prop.name, prop.value.replace("'", "").replace("\"", ""));
                    collector.insert(rule);
                    classes.push(class);
                }
            }
            *class_name = classes.join(" ");
            for child in children {
                transform_and_extract_css(child, collector);
            }
        }
        ZenithNode::Leaf { properties, class_name, .. } => {
            let mut classes = Vec::new();
            for prop in properties {
                if is_style_prop(&prop.name) {
                    let class = format!("{}-{}", prop.name, prop.value.replace("'", "").replace("\"", ""));
                    let rule = format!(".{} {{ {}: {}; }}", class, prop.name, prop.value.replace("'", "").replace("\"", ""));
                    collector.insert(rule);
                    classes.push(class);
                }
            }
            *class_name = classes.join(" ");
        }
        _ => {}
    }
}

fn is_style_prop(name: &str) -> bool {
    match name {
        "gap" | "padding" | "margin" | "background" | "color" | "radius" | "display" | "justify" | "align" => true,
        _ => false,
    }
}

// --- Lexer & Parser Implementation (Same as before, with minor property fix) ---

#[derive(Debug, PartialEq, Clone)]
enum Token {
    Ident(String),
    String(String),
    OpenBrace,
    CloseBrace,
    Colon,
    Semicolon,
    EOF,
}

struct Lexer {
    input: Vec<char>,
    pos: usize,
}

impl Lexer {
    fn new(input: &str) -> Self {
        Self { input: input.chars().collect(), pos: 0 }
    }

    fn next_token(&mut self) -> Token {
        self.skip_whitespace();
        if self.pos >= self.input.len() { return Token::EOF; }

        let ch = self.input[self.pos];
        match ch {
            '{' => { self.pos += 1; Token::OpenBrace }
            '}' => { self.pos += 1; Token::CloseBrace }
            ':' => { self.pos += 1; Token::Colon }
            ';' => { self.pos += 1; Token::Semicolon }
            '\'' | '"' => self.read_string(),
            _ if ch.is_alphabetic() => self.read_ident(),
            _ => { self.pos += 1; self.next_token() }
        }
    }

    fn read_string(&mut self) -> Token {
        let quote = self.input[self.pos];
        self.pos += 1;
        let mut s = String::new();
        while self.pos < self.input.len() && self.input[self.pos] != quote {
            s.push(self.input[self.pos]);
            self.pos += 1;
        }
        self.pos += 1;
        Token::String(s)
    }

    fn read_ident(&mut self) -> Token {
        let mut s = String::new();
        while self.pos < self.input.len() && (self.input[self.pos].is_alphanumeric() || self.input[self.pos] == '-') {
            s.push(self.input[self.pos]);
            self.pos += 1;
        }
        Token::Ident(s)
    }

    fn skip_whitespace(&mut self) {
        while self.pos < self.input.len() && self.input[self.pos].is_whitespace() {
            self.pos += 1;
        }
    }
}

struct Parser {
    lexer: Lexer,
    curr_token: Token,
}

impl Parser {
    fn new(input: &str) -> Self {
        let mut lexer = Lexer::new(input);
        let curr_token = lexer.next_token();
        Self { lexer, curr_token }
    }

    fn advance(&mut self) {
        self.curr_token = self.lexer.next_token();
    }

    fn parse(&mut self) -> ZenithNode {
        match &self.curr_token {
            Token::Ident(name) => {
                let node_name = name.clone();
                self.advance();
                
                if let Token::OpenBrace = self.curr_token {
                    self.advance();
                    self.parse_container(node_name)
                } else {
                    ZenithNode::Leaf { name: node_name, properties: vec![], class_name: "".to_string() }
                }
            }
            Token::String(s) => {
                let val = s.clone();
                self.advance();
                ZenithNode::TextLiteral { value: val }
            }
            _ => ZenithNode::TextLiteral { value: "Unknown".to_string() }
        }
    }

    fn parse_container(&mut self, name: String) -> ZenithNode {
        let mut properties = vec![];
        let mut children = vec![];

        while self.curr_token != Token::CloseBrace && self.curr_token != Token::EOF {
            match &self.curr_token {
                Token::Ident(prop_name) => {
                    let next = self.lexer.clone().next_token();
                    if let Token::Colon = next {
                        let p_name = prop_name.clone();
                        self.advance();
                        self.advance();
                        if let Token::String(val) | Token::Ident(val) = &self.curr_token {
                            properties.push(Property { name: p_name, value: val.clone() });
                        }
                        self.advance();
                        if let Token::Semicolon = self.curr_token { self.advance(); }
                    } else {
                        children.push(self.parse());
                    }
                }
                _ => {
                   let node = self.parse();
                   if let ZenithNode::TextLiteral { value } = &node {
                       if value == "Unknown" { self.advance(); continue; }
                   }
                   children.push(node);
                }
            }
        }
        self.advance();

        ZenithNode::Container { name, properties, children, class_name: "".to_string() }
    }
}

impl Clone for Lexer {
    fn clone(&self) -> Self {
        Self { input: self.input.clone(), pos: self.pos }
    }
}

#[wasm_bindgen]
pub fn compile_zenith(input: &str) -> JsValue {
    let result = compile_logic(input);
    serde_wasm_bindgen::to_value(&result)
        .unwrap_or(JsValue::NULL)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_css_extraction() {
        let input = "Column { gap: '10'; padding: '20'; Text { value: 'Hi' } }";
        let result = compile_logic(input);
        
        assert!(result.css.contains(".gap-10 { gap: 10; }"));
        assert!(result.css.contains(".padding-20 { padding: 20; }"));
        
        if let Some(ZenithNode::Container { class_name, .. }) = result.ast {
            assert!(class_name.contains("gap-10"));
            assert!(class_name.contains("padding-20"));
        }
    }
}
