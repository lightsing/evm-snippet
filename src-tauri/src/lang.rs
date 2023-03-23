use std::str::FromStr;
use eth_types::{Bytecode, ToLittleEndian, Word};
use eth_types::evm_types::OpcodeId;
use log::debug;
use serde::{Deserialize, Serialize, Serializer};
use tauri::InvokeError;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum TokenType {
    Number,
    Keyword,
    Unexpected,
}

#[derive(Debug, Deserialize)]
pub struct Token {
    #[serde(rename = "type")]
    ty: TokenType,
    content: String,
}

pub enum LangError {
    Unexpected {
        waiting_number: bool,
        content: String,
    },
    UncompletedPush(u8),
    UnexpectedNumber,
}

impl Serialize for LangError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error> where S: Serializer {
        match self {
            LangError::UncompletedPush(len) => {
                serializer.serialize_str(format!("Expecting number literal of PUSH{}", len).as_str())
            },
            LangError::UnexpectedNumber => {
                serializer.serialize_str("Expecting opcode but got number literal")
            },
            LangError::Unexpected{ waiting_number, content } => {
                serializer.serialize_str(format!(
                    "Expecting {} but got '{}'",
                    if *waiting_number { "number literal" } else { "opcode" },
                    content
                ).as_str())
            },
        }
    }
}

pub fn parse_tokens(tokens: Vec<Token>) -> Result<Bytecode, LangError> {
    let mut buffer = Vec::new();
    let mut push_n = None;
    for token in tokens.into_iter() {
        match token.ty {
            TokenType::Number => {
                if push_n.is_none() {
                    return Err(LangError::UnexpectedNumber);
                }
                let word = if token.content.starts_with("0x") {
                    Word::from_str_radix(&token.content[2..], 16).unwrap()
                } else {
                    Word::from_str(&token.content).unwrap()
                };
                buffer.extend_from_slice(&word.to_le_bytes()[..push_n.unwrap() as usize]);
                push_n = None;
            }
            TokenType::Keyword => {
                if push_n.is_some() {
                    return Err(LangError::UncompletedPush(push_n.unwrap()));
                }
                let op = OpcodeId::from_str(token.content.as_str()).unwrap();
                buffer.push(op.as_u8());
                if op.as_u8() >= OpcodeId::PUSH1.as_u8() && op.as_u8() <= OpcodeId::PUSH32.as_u8() {
                    push_n = Some(op.as_u8() - OpcodeId::PUSH1.as_u8() + 1)
                }
                debug!("{}", op);
            }
            TokenType::Unexpected => {
                return Err(LangError::Unexpected {
                    waiting_number: push_n.is_some(),
                    content: token.content,
                });
            }
        }
    }
    Ok(Bytecode::from(buffer))
}