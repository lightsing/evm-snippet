use std::error::Error;
use serde::{Serialize, Serializer};

macro_rules! serialize_error {
    ($error:ty) => {
        impl Serialize for $error {
            fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
            where
                S: Serializer,
            {
                serializer.serialize_str(format!("{}", self).as_str())
            }
        }
    };
}

#[derive(Debug, thiserror::Error)]
pub enum LangError {
    #[error("unexpected token: {0}")]
    Unexpected(String),
    #[error("expecting number literal of PUSH{0}")]
    UncompletedPush(u8),
    #[error("Expecting opcode but got number literal")]
    UnexpectedNumber,
}

#[derive(Debug, thiserror::Error)]
pub enum AccountError {
    #[error("invalid address: \"{0}\"")]
    InvalidAddress(String),
    #[error(transparent)]
    InvalidCode(#[from] LangError),
}


#[derive(Debug, thiserror::Error)]
pub enum ExecuteError {
    #[error("invalid number: {0}")]
    InvalidNumber(String),
    #[error(transparent)]
    Account(#[from] AccountError),
    #[error("geth error: {0}")]
    Geth(#[from] eth_types::Error),
}

serialize_error!(LangError);
serialize_error!(AccountError);
serialize_error!(ExecuteError);