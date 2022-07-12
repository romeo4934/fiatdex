use anchor_lang::prelude::*;

use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::consts::*;
use crate::error::CustomErrors;
use crate::program_accounts::*;

use agnostic_orderbook::state::critbit::Slab;
use agnostic_orderbook::state::event_queue::EventQueueHeader;

use agnostic_orderbook::state::{Side,SelfTradeBehavior};

use crate::consts::*;
use crate::program_accounts::*;


// Flexible on design decisions such as:
// - Using start time as part of the seeds to allow more than one auction
//   per auctioneer account. Open to other suggestions on namespaces
#[derive(Accounts)]
#[instruction(market_id: [u8; 10], min_base_order_size: u64, tick_size: u64)]
pub struct InitMarket<'info> {
    #[account(mut)]
    pub marketer: Signer<'info>,
    // Program Accounts
    // An account struct with all of the auction options
    #[account(
        init,
        seeds = [MARKET.as_bytes(), &market_id, marketer.key().as_ref()],
        bump,
        space = 1000,
        payer = marketer,
    )]
    pub market: Box<Account<'info, Market>>,
    /// CHECK: This is zeroed and owned by the program
    #[account(zero, owner = crate::ID)]
    pub event_queue: UncheckedAccount<'info>,
    /// CHECK: This is zeroed and owned by the program
    #[account(zero, owner = crate::ID)]
    pub bids: UncheckedAccount<'info>,
    /// CHECK: This is zeroed and owned by the program
    #[account(zero, owner = crate::ID)]
    pub asks: UncheckedAccount<'info>,
    // Token vaults
    pub quote_mint: Account<'info, Mint>,
    pub base_mint: Account<'info, Mint>,
    #[account(
        init,
        token::mint = quote_mint,
        token::authority = market, // It should probably be the market account, since it will sign
        seeds = [QUOTE_VAULT.as_bytes(), &market_id, marketer.key().as_ref()],
        bump,
        payer = marketer,
    )]
    pub quote_vault: Account<'info, TokenAccount>,
    #[account(
        init,
        token::mint = base_mint,
        token::authority = market, // It should probably be the market account, since it will sign
        seeds = [BASE_VAULT.as_bytes(), &market_id, marketer.key().as_ref()],
        bump,
        payer = marketer,
    )]
    pub base_vault: Account<'info, TokenAccount>,
    // Sysvars
    pub rent: Sysvar<'info, Rent>,
    // Programs
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

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