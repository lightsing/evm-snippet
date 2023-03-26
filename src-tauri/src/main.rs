#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

mod lang;
mod helper;
mod error;

use std::collections::HashMap;
use std::str::FromStr;
use anyhow::{anyhow, bail};
use eth_types::{Address, Bytecode, GethExecTrace, ToLittleEndian, Word};
use eth_types::evm_types::OpcodeId;
use log::debug;
use mock::{eth, TestContext};
use tauri::InvokeError;
use serde::{Deserialize, Serialize, Serializer};
use crate::error::{AccountError, ExecuteError};

use crate::lang::{parse_tokens, Token};
use crate::helper::{deserialize_option_string, parse_word};

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
    #[serde(default, deserialize_with = "deserialize_option_string")]
    nonce: Option<String>,
    #[serde(default, deserialize_with = "deserialize_option_string")]
    balance: Option<String>,
    code: Vec<Token>,
    storage: Vec<(String, String)>,
}

#[derive(Debug)]
struct ParsedAccount {
    address: Address,
    nonce: Word,
    balance: Word,
    code: Option<Bytecode>,
}

impl TryFrom<Account> for ParsedAccount {
    type Error = AccountError;
    fn try_from(account: Account) -> Result<Self, Self::Error> {
        let address = Address::from_str(&account.address)
            .map_err(|_| AccountError::InvalidAddress(account.address))?;
        let mut parsed_account = ParsedAccount {
            address,
            nonce: Word::zero(),
            balance: eth(1),
            code: None,
        };
        if let Some(nonce) = account.nonce {
            parsed_account.nonce = parse_word(nonce)?;
        }
        if !account.code.is_empty() {
            parsed_account.code = Some(parse_tokens(account.code)?);
        }
        Ok(parsed_account)
    }
}

#[derive(Debug, Deserialize)]
struct ExecuteArgs {
    accounts: Vec<Account>,
    from: String,
    to: String,
    #[serde(default, deserialize_with = "deserialize_option_string")]
    gas: Option<String>,
    #[serde(default, deserialize_with = "deserialize_option_string")]
    value: Option<String>,
    calldata: String,
}


#[tauri::command]
fn execute(args: ExecuteArgs) -> Result<Vec<GethExecTrace>, ExecuteError> {
    let ExecuteArgs {
        accounts, from, to, gas, value, calldata
    } = args;
    println!("{:?}", accounts);
    let accounts = accounts
        .into_iter()
        .map(ParsedAccount::try_from)
        .collect::<Result<Vec<ParsedAccount>, AccountError>>()?;
    let from = Address::from_str(&from).map_err(|_| AccountError::InvalidAddress(from))?;
    let to = Address::from_str(&to).map_err(|_| AccountError::InvalidAddress(to))?;
    let gas = parse_word(gas.unwrap_or_else(|| "0xFFFFF".to_string()))?;
    let value = parse_word(value.unwrap_or_else(|| "0".to_string()))?;
    println!("from: {}, to: {}, gas: {}, value: {}", from, to, gas, value);

    let ctx = TestContext::<MAX_ALLOWED_ACCOUNTS, 1>::new(
        None,
        |accs| {
            for (idx, account) in accounts.iter().enumerate() {
                accs[idx]
                    .address(account.address)
                    .balance(eth(1));
                if let Some(ref code) = account.code {
                    accs[idx].code(code.clone());
                }
            }
        },
        |mut txs, accs| {
            txs[0]
                .from(from)
                .to(to)
                .gas(gas)
                .value(value);
        },
        |block, _tx| block.number(0xcafe_u64),
    )?;
    println!("{:?}", ctx);
    Ok(ctx.geth_traces)
}

fn main() {
    pretty_env_logger::init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![validate_code, execute])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}