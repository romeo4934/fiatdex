use anchor_lang::prelude::*;

use agnostic_orderbook::state::{Side,SelfTradeBehavior};

use instructions::*;
use types::*;
use program_accounts::*;
use error::*;

mod consts;
mod error;
pub mod program_accounts;
pub mod instructions;
pub mod types;

declare_id!("5f3Q4hsMW3UboR9nhwYvDWjLUVJpnNm545hekKe1Gs3W");

#[program]
pub mod fiatdex {
    use super::*;

    pub fn init_market(ctx: Context<InitMarket>, market_id: [u8; 10], min_base_order_size: u64, tick_size: u64) -> Result<()> {
        instructions::init_market(ctx, market_id, min_base_order_size, tick_size)
    }

    pub fn new_order(ctx: Context<NewOrder>, side: Side, limit_price: u64, max_base_qty: u64) -> Result<()> {
        instructions::new_order(ctx, side, limit_price, max_base_qty)
    }

    pub fn new_taker_order(_ctx: Context<InitMarket>) -> Result<()> {
        Ok(())
    }
}
