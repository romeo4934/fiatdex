use anchor_lang::prelude::*;

use crate::types::*;

#[derive(Default, Debug)]
pub struct OpenOrder {
    pub owner: Pubkey,
    pub market: Pubkey,
    pub quote_token_free: u64,
    pub quote_token_locked: u64,
    // Active orders
    pub number_of_orders: u8,
    pub orders: Vec<u128>,
}