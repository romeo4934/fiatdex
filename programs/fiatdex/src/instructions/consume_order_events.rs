use anchor_lang::prelude::*;

use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::consts::*;
use crate::error::CustomErrors;
use crate::program_accounts::*;
use crate::types::*;

use agnostic_orderbook::state::{SelfTradeBehavior};
use agnostic_orderbook::error::AoError;
use agnostic_orderbook::state::market_state::MarketState;

use anchor_lang::solana_program::program_error::PrintProgramError;


#[derive(Accounts)]
pub struct ConsumeOrderEvents<'info> {
    #[account(mut)]
    pub event_queue: AccountInfo<'info>,

    #[account(mut)]
    pub orderbook: AccountInfo<'info>,

    #[account()]
    pub system_program: Program<'info, System>, // Later could be used for paying rewards and maybe transaction fee
}

pub fn consume_order_events(ctx: Context<ConsumeOrderEvents>, max_iterations: u64) -> Result<()> {
    
    Ok(())
}