use anchor_lang::prelude::*;

use anchor_spl::token::{self, Mint, Token, TokenAccount};

use agnostic_orderbook::state::{Side,SelfTradeBehavior};

use crate::consts::*;
use crate::error::CustomErrors;
use crate::program_accounts::*;




pub fn init_market(ctx: Context<InitMarket>, market_id: [u8; 10], min_base_order_size: u64, tick_size: u64) -> Result<()> {
    
    let this = Side::Ask;
    match this {
        Side::Bid => {
            msg!("hey it's a bid");
        }
        Side::Ask => {
            msg!("hey it's an ask");
        }
    };
    Ok(())
}

#[derive(Accounts)]
pub struct InitMarket {
}