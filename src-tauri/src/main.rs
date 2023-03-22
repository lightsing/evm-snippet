#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::str::FromStr;
use anyhow::{anyhow, bail};
use eth_types::{Bytecode, ToLittleEndian, Word};
use eth_types::evm_types::OpcodeId;
use eth_types::geth_types::Account;
use log::debug;
use serde::Deserialize;
use tauri::InvokeError;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "lowercase")]
enum TokenType {
    Comment,
    Number,
    Keyword,
}

#[derive(Debug, Deserialize)]
struct Token {
    #[serde(rename = "type")]
    ty: TokenType,
    content: String,
}

enum Error {
    UncompletedPush,
    UnexpectedNumber,
}

impl Into<InvokeError> for Error {
    fn into(self) -> InvokeError {
        match self {
            Error::UncompletedPush => {
                InvokeError::from("uncompleted push opcode")
            },
            Error::UnexpectedNumber => {
                InvokeError::from("unexpected number")
            },
        }
    }
}

#[tauri::command]
fn run_code(tokens: Vec<Token>) -> Result<(), Error> {
    println!("{:?}", tokens);
    let mut buffer = vec![];
    let mut push_n = None;
    for token in tokens {
        match token.ty {
            TokenType::Keyword => {
                if push_n.is_some() {
                    return Err(Error::UncompletedPush);
                }
                let op = OpcodeId::from_str(token.content.as_str()).unwrap();
                buffer.push(op.as_u8());
                if op.as_u8() >= OpcodeId::PUSH1.as_u8() && op.as_u8() <= OpcodeId::PUSH32.as_u8() {
                    push_n = Some(op.as_u8() - OpcodeId::PUSH1.as_u8() + 1)
                }
                debug!("{}", op);
            },
            TokenType::Number => {
                if push_n.is_none() {
                    return Err(Error::UnexpectedNumber);
                }
                let word = if token.content.starts_with("0x") {
                    Word::from_str_radix(&token.content[2..], 16).unwrap()
                } else {
                    Word::from_str(&token.content).unwrap()
                };
                buffer.extend_from_slice(&word.to_le_bytes()[..push_n.unwrap() as usize]);
                push_n = None;
            },
            TokenType::Comment => continue,
        }
    }
    debug!("{:?}", buffer);
    Ok(())
}

fn main() {
    pretty_env_logger::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_code])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}