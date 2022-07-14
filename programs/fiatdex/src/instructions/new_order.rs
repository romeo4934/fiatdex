use anchor_lang::prelude::*;

use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::consts::*;
use crate::error::CustomErrors;
use crate::program_accounts::*;

use agnostic_orderbook::state::{Side,SelfTradeBehavior};
use agnostic_orderbook::error::AoError;
use agnostic_orderbook::state::market_state::MarketState;

use anchor_lang::solana_program::program_error::PrintProgramError;


#[derive(Accounts)]
pub struct NewOrder<'info> {
    pub user: Signer<'info>,
    // Program Accounts
    #[account(
        seeds = [MARKET.as_bytes(), &market.market_id, market.authority.as_ref()],
        bump = market.bump,
    )]
    pub market: Box<Account<'info, Market>>,
    // AOB Accounts
    /// CHECK: This should be owned by the program
    #[account(
        address = market.event_queue,
        owner = crate::ID,
        mut
    )]
    pub event_queue: UncheckedAccount<'info>,
    /// CHECK: This should be owned by the program
    #[account(
        address = market.bids,
        owner = crate::ID,
        mut
    )]
    pub bids: UncheckedAccount<'info>,
    /// CHECK: This should be owned by the program
    #[account(
        address = market.asks,
        owner = crate::ID,
        mut
    )]
    pub asks: UncheckedAccount<'info>,
    /// CHECK: This should be owned by the program
    #[account(
        address = market.orderbook,
        owner = crate::ID,
        mut
    )]
    pub orderbook: UncheckedAccount<'info>,
    // Token accounts
    #[account(address = market.quote_mint)]
    pub quote_mint: Box<Account<'info, Mint>>,
    #[account(address = market.base_mint)]
    pub base_mint: Box<Account<'info, Mint>>,
    #[account(
        associated_token::mint = quote_mint,
        associated_token::authority = user,
        mut
    )]
    pub user_quote: Account<'info, TokenAccount>,
    #[account(
        associated_token::mint = base_mint,
        associated_token::authority = user,
        mut
    )]
    pub user_base: Account<'info, TokenAccount>,
    #[account(
        seeds = [QUOTE_VAULT.as_bytes(), &market.market_id, market.authority.as_ref()],
        bump = market.bumps.quote_vault,
        mut
    )]
    pub quote_vault: Account<'info, TokenAccount>,
    #[account(
        seeds = [BASE_VAULT.as_bytes(), &market.market_id, market.authority.as_ref()],
        bump = market.bumps.base_vault,
        mut
    )]
    pub base_vault: Account<'info, TokenAccount>,
    // Programs
    pub token_program: Program<'info, Token>,
}

pub fn new_order(ctx: Context<NewOrder>, side: Side, limit_price: u64, max_base_qty: u64) -> Result<()> {
    
    
    let alice = [1; 32];

    let invoke_params = agnostic_orderbook::instruction::new_order::Params {
        max_base_qty: max_base_qty,
        max_quote_qty: u64::MAX,
        limit_price: limit_price,
        side: side,
        match_limit: 1,
        callback_info: alice,
        post_only: true,
        post_allowed: true,
        self_trade_behavior: SelfTradeBehavior::AbortTransaction,
    };

    msg!("max base qty: {}, limit price in FP32: {}", max_base_qty, limit_price);

   
    if let Err(error) =
        agnostic_orderbook::instruction::new_order::process(ctx.program_id, agnostic_orderbook::instruction::new_order::Accounts {
            market: &ctx.accounts.orderbook,
            asks: &ctx.accounts.asks,
            bids: &ctx.accounts.bids,
            event_queue: &ctx.accounts.event_queue,
        }, invoke_params,
    ) {
        
        let error_display = error.print::<AoError>();
        msg!("Error: {:?}", error_display) ;
        return Err(error!(CustomErrors::InvalidOrder))
    }
    Ok(())
}