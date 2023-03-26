use std::str::FromStr;
use eth_types::Word;
use serde::{Deserialize, Deserializer};
use crate::AccountError;

pub fn deserialize_option_string<'de, D>(deserializer: D) -> Result<Option<String>, D::Error>
    where
        D: Deserializer<'de>,
{
    let s = Option::<String>::deserialize(deserializer)?
        .and_then(|s|  if s.is_empty() { None } else { Some(s) });

    Ok(s)
}

pub fn parse_word<S: AsRef<str>>(literal: S) -> Result<Word, AccountError> {
    let s = literal.as_ref();
    Ok(
        if s.starts_with("0x") {
            Word::from_str_radix(&s[2..], 16)
                .map_err(|_| AccountError::InvalidAddress(s.to_string()))?
        } else {
            Word::from_str(s)
                .map_err(|_| AccountError::InvalidAddress(s.to_string()))?
        }
    )
}