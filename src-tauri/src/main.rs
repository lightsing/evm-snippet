#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

mod lang;

use std::str::FromStr;
use anyhow::{anyhow, bail};
use eth_types::{Bytecode, ToLittleEndian, Word};
use eth_types::evm_types::OpcodeId;
use eth_types::geth_types::Account;
use log::debug;
use tauri::InvokeError;

use crate::lang::{parse_tokens, Token};

#[tauri::command]
fn validate_code(tokens: Vec<Token>) -> Result<(), InvokeError> {
    println!("{:?}", tokens);
    parse_tokens(tokens)?;
    Ok(())
}

fn main() {
    pretty_env_logger::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![validate_code])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}