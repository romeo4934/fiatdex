use anchor_lang::prelude::*;

use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::consts::*;
use crate::error::CustomErrors;
use crate::program_accounts::*;
use crate::types::*;

use agnostic_orderbook::state::event_queue::EventQueue;
use agnostic_orderbook::state::AccountTag;
use agnostic_orderbook::state::market_state::MarketState;
use agnostic_orderbook::state::critbit::Slab;




#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        seeds = [MARKET.as_bytes(), &market.market_id, market.authority.as_ref()],
        bump = market.bump,
    )]
    pub market: Box<Account<'info, Market>>,
    #[account(
        init,
        seeds = [user.key().as_ref(), OPEN_ORDERS.as_bytes(), &market.market_id, market.authority.as_ref()],
        bump,
        space = 332, // better compute the space probably we can reduce a little bit
        payer = user,
    )]
    pub open_orders: Box<Account<'info, OpenOrders>>,
    pub system_program: Program<'info, System>,
}

pub fn widthdraw(ctx: Context<InitOpenOrders>) -> Result<()> {
    
    Ok(())

}