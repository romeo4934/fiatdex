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

use agnostic_orderbook::{
    state::{
        event_queue::{EventQueue, EventQueueHeader, EventRef, FillEvent, FillEventRef, OutEvent, OutEventRef},
        AccountTag, Side as AobSide,
    },
};


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

pub fn new_order(ctx: Context<NewOrder>, side: Side, limit_price: u64, max_base_qty: u64, is_broker: bool) -> Result<()> {
    
    
    let user; 

    let post_only;
    let post_allowed;

    // Broker should be only a maker and other users should be always a taker
    if is_broker {
        user = [1; 32];
        (post_only, post_allowed)=(true, true);
    } else {
        user = [2; 32];
        (post_only, post_allowed)=(false, false);
    }

    msg!("is Broker?: {:?}, Side: {:?}, max base qty: {:?}, limit price in FP32: {:?}",is_broker,  side, max_base_qty, limit_price);

    let invoke_params = agnostic_orderbook::instruction::new_order::Params {
        max_base_qty: max_base_qty,
        max_quote_qty: u64::MAX,
        limit_price: limit_price,
        side: AobSide::from(side),
        match_limit: 2,
        callback_info: user,
        post_only: post_only,
        post_allowed: post_allowed,
        self_trade_behavior: SelfTradeBehavior::AbortTransaction,
    };

    

   
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

    // Lets try!

    let mut event_queue_guard = ctx.accounts.event_queue.data.borrow_mut();

    let event_queue =
        EventQueue::<[u8; 32]>::from_buffer(&mut event_queue_guard, AccountTag::EventQueue)?;

    let event =    event_queue.iter().next();
    
    msg!("EVENT {:?}", event);

    // Verify how much tokens we should wire in the pending trading zone

    Ok(())
}