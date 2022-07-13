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
    // Intermediate information while matching the orderbook
    pub ask_search_stack_depth: u8,
    pub bid_search_stack_depth: u8,
    pub ask_search_stack_values: [u32; 32],
    pub bid_search_stack_values: [u32; 32],
    pub current_bid_key: u128,
    pub current_ask_key: u128,
    pub current_bid_quantity_filled: u64,
    pub current_ask_quantity_filled: u64,
    pub total_quantity_filled_so_far: u64,
    // Details once the auction clearing price has been found
    pub has_found_clearing_price: bool,
    pub total_quantity_matched: u64,
    pub remaining_ask_fills: u64,
    pub remaining_bid_fills: u64,
    pub final_bid_price: u64,
    pub final_ask_price: u64,
    pub clearing_price: u64,
}