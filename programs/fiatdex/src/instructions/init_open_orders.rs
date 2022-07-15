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
#[instruction(max_orders: u8)]
pub struct InitOpenOrders<'info> {
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
        space = {
            let mut this_space: usize = 172;
            this_space = this_space.checked_add(16_usize.checked_mul(max_orders as usize).unwrap()).unwrap();
            msg!("space for this open orders {}", this_space);
            this_space
        },
        payer = user,
    )]
    pub open_orders: Box<Account<'info, OpenOrders>>,
    pub system_program: Program<'info, System>,
}

pub fn init_open_orders(ctx: Context<InitOpenOrders>, market_id: [u8; 10]) -> Result<()> {
    
    
    Ok(())


}