use anchor_lang::prelude::*;

use crate::types::*;

pub const USER_OPEN_ORDERS_SIZE: usize = 16;

#[account(zero_copy)]
pub struct UserAccount {
    pub owner: Pubkey,
    pub market: Pubkey,
    pub base_token_free: u64,
    pub base_token_locked: u64,
    pub quote_token_free: u64,
    pub quote_token_locked: u64,
    // Active orders
    pub number_of_orders: u8,
    pub orders: [u128; USER_OPEN_ORDERS_SIZE], 
    _padding: [u8; 6]
}