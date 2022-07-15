use anchor_lang::prelude::*;

use crate::types::*;

#[account]
#[derive(Default, Debug)]
pub struct Market {
    // General auction options
    pub bump: u8,
    pub bumps: AobBumps,
    pub authority: Pubkey,
    pub market_id: [u8; 10],
    pub orderbook: Pubkey,
    pub event_queue: Pubkey,
    pub bids: Pubkey,
    pub asks: Pubkey,
    pub quote_mint: Pubkey,
    pub base_mint: Pubkey,
    pub quote_vault: Pubkey,
    pub base_vault: Pubkey,
    pub min_base_order_size: u64,
    pub tick_size: u64,
}