#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

mod lang;

use std::str::FromStr;
use anyhow::{anyhow, bail};
use eth_types::{Address, Bytecode, GethExecTrace, ToLittleEndian, Word};
use eth_types::evm_types::OpcodeId;
use log::debug;
use mock::{eth, TestContext};
use tauri::InvokeError;
use serde::{Deserialize, Serialize, Serializer};

use crate::lang::{LangError, parse_tokens, Token};

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

#[derive(Debug)]
struct ParsedAccount {
    address: Address,
    code: Option<Bytecode>,
}

#[derive(Debug, thiserror::Error)]
enum AccountError {
    #[error("invalid address: \"{0}\"")]
    InvalidAddress(String),
    #[error(transparent)]
    InvalidCode(#[from] LangError),
}

impl Serialize for AccountError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error> where S: Serializer {
        serializer.serialize_str(format!("{}", self).as_str())
    }
}

impl TryFrom<Account> for ParsedAccount {
    type Error = AccountError;
    fn try_from(account: Account) -> Result<Self, Self::Error> {
        let address = Address::from_str(&account.address)
            .map_err(|_| AccountError::InvalidAddress(account.address))?;
        if account.code.is_empty() {
            Ok(ParsedAccount {
                address,
                code: None,
            })
        } else {
            Ok(ParsedAccount {
                address,
                code: Some(parse_tokens(account.code)?),
            })
        }
    }
}

fn parse_may_empty_word(literal: &str) -> Result<Option<Word>, AccountError> {
    if literal.is_empty() {
        return Ok(None);
    }
    Ok(
        Some(
            if literal.starts_with("0x") {
                Word::from_str_radix(&literal[2..], 16)
                    .map_err(|_| AccountError::InvalidAddress(literal.to_string()))?
            } else {
                Word::from_str(literal)
                    .map_err(|_| AccountError::InvalidAddress(literal.to_string()))?
            }
        )
    )
}

#[derive(Debug, thiserror::Error)]
enum ExecuteError {
    #[error("invalid number: {0}")]
    InvalidNumber(String),
    #[error(transparent)]
    Account(#[from] AccountError),
    #[error("geth error: {0}")]
    Geth(#[from] eth_types::Error),
}

impl Serialize for ExecuteError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error> where S: Serializer {
        serializer.serialize_str(format!("{}", self).as_str())
    }
}

#[tauri::command]
fn execute(
    accounts: Vec<Account>,
    from: String,
    to: String,
    gas: String,
    value: String,
    calldata: String,
) -> Result<Vec<GethExecTrace>, ExecuteError> {
    println!("{:?}", accounts);
    println!("from: {}, to: {}, gas: {}, value: {}", from, to, gas, value);
    let accounts = accounts
        .into_iter()
        .map(ParsedAccount::try_from)
        .collect::<Result<Vec<ParsedAccount>, AccountError>>()?;
    let from = Address::from_str(&from).map_err(|_| AccountError::InvalidAddress(from))?;
    let to = Address::from_str(&to).map_err(|_| AccountError::InvalidAddress(to))?;
    let gas = parse_may_empty_word(gas.as_str())?;
    let value = parse_may_empty_word(value.as_str())?;

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
                .to(to);
            if let Some(gas) = gas {
                txs[0].gas(gas);
            }
            if let Some(value) = value {
                txs[0].value(value);
            }
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