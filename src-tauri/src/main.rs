#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

mod lang;

use std::str::FromStr;
use anyhow::{anyhow, bail};
use eth_types::{Bytecode, ToLittleEndian, Word};
use eth_types::evm_types::OpcodeId;
use log::debug;
use tauri::InvokeError;
use serde::Deserialize;

use crate::lang::{parse_tokens, Token};

#[tauri::command]
fn validate_code(tokens: Vec<Token>) -> Result<(), InvokeError> {
    println!("{:?}", tokens);
    parse_tokens(tokens)?;
    Ok(())
}

const MAX_ALLOWED_ACCOUNTS: usize = 10;

#[derive(Debug, Deserialize)]
struct Account {
    address: String,
    code: Vec<Token>,
}

#[tauri::command]
fn execute(
    accounts: Vec<Account>,
    from: String,
    to: String,
    gas: String,
    value: String,
    calldata: String,
) {
    println!("{:?}", accounts);
    println!("from: {}, to: {}, gas: {}, value: {}", from, to, gas, value);
    // let ctx = TestContext::<MAX_ALLOWED_ACCOUNTS, 1>::new(
    //     None,
    //     |accs| {
    //
    //     },
    //     |txs, accs| {
    //
    //     },
    //     |block, _tx| block.number(0xcafe_u64),
    // ).unwrap();
}

fn main() {
    pretty_env_logger::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![validate_code, execute])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}