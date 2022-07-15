use anchor_lang::prelude::*;

use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::consts::*;
use crate::error::CustomErrors;
use crate::program_accounts::*;
use crate::types::*;

use crate::consts::*;
use crate::program_accounts::*;

use agnostic_orderbook::state::event_queue::EventQueue;
use agnostic_orderbook::state::AccountTag;
use agnostic_orderbook::state::market_state::MarketState;
use agnostic_orderbook::state::critbit::Slab;




#[derive(Accounts)]
pub struct InitOpenOrder<'info> {
}

pub fn init_user_account(ctx: Context<InitOpenOrder>, market_id: [u8; 10]) -> Result<()> {
    
    
    Ok(())


}