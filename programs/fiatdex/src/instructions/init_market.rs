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
use agnostic_orderbook::state::critbit::Slab;



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
    
    ctx.accounts.market.set_inner(Market {
        bump: *ctx.bumps.get("market").unwrap(),
        bumps: AobBumps {
            quote_vault: *ctx.bumps.get("quote_vault").unwrap(),
            base_vault: *ctx.bumps.get("base_vault").unwrap(),
        },
        authority: ctx.accounts.marketer.key(),
        market_id: market_id,
        // Order book stuff
        event_queue: ctx.accounts.event_queue.key(),
        bids: ctx.accounts.bids.key(),
        asks: ctx.accounts.asks.key(),
        quote_mint: ctx.accounts.quote_mint.key(),
        base_mint: ctx.accounts.base_mint.key(),
        quote_vault: ctx.accounts.quote_vault.key(),
        base_vault: ctx.accounts.base_vault.key(),
        min_base_order_size: min_base_order_size,
        tick_size: tick_size,
        // Everything else defaults to 0
        current_bid_key: 0,
        current_ask_key: 0,
        current_bid_quantity_filled: 0,
        current_ask_quantity_filled: 0,
        total_quantity_filled_so_far: 0,
        has_found_clearing_price: false,
        total_quantity_matched: 0,
        remaining_bid_fills: 0,
        remaining_ask_fills: 0,
        final_bid_price: 0,
        final_ask_price: 0,
        clearing_price: 0,
        ask_search_stack_depth: 0,
        ask_search_stack_values: [0; 32],
        bid_search_stack_depth: 0,
        bid_search_stack_values: [0; 32],
    });

    let invoke_params = agnostic_orderbook::instruction::create_market::Params {
        min_base_order_size: 10,
        tick_size: 10,
    };


    let invoke_accounts= agnostic_orderbook::instruction::create_market::Accounts {
        market: &ctx.accounts.market.to_account_info(),
        event_queue: &ctx.accounts.event_queue.to_account_info(),
        bids: &ctx.accounts.bids.to_account_info(),
        asks: &ctx.accounts.asks.to_account_info(),
    };

    msg!("Progam: MIMIIIIIIIIII");
    msg!("Progam: {:?}",  ctx.program_id);

    
    if let Err(error) = agnostic_orderbook::instruction::create_market::process::<BasicCallBack>(
        ctx.program_id,
        invoke_accounts,
        invoke_params,
    ) {
        msg!("{}", error);
        return Err(error!(CustomErrors::InvalidMarket))
    }

   

    /*

    let mut event_queue_data = ctx.accounts.event_queue.data.borrow_mut();
    


   EventQueue::<BasicCallBack>::from_buffer(&mut event_queue_data, AccountTag::Uninitialized)?;
    

    EventQueue::<C>::from_buffer(&mut event_queue_data, AccountTag::Uninitialized)?;

    


    // Init event queue
    let event_queue_header = EventQueueHeader::initialize(CALLBACK_INFO_LEN);
    event_queue_header
        .serialize(&mut (&mut ctx.accounts.event_queue.data.borrow_mut() as &mut [u8]))
        .unwrap();

    // Init orderbook
    Slab::initialize(
        &ctx.accounts.bids,
        &ctx.accounts.asks,
        ctx.accounts.auction.key(),
        CALLBACK_INFO_LEN,
    );

    
    ---------


    let invoke_accounts= agnostic_orderbook::instruction::create_market::Accounts {
        market: &ctx.accounts.market.to_account_info(),
        event_queue: &ctx.accounts.event_queue.to_account_info(),
        bids: &ctx.accounts.bids.to_account_info(),
        asks: &ctx.accounts.asks.to_account_info(),
    };


    msg!("Progam: {:?}",  ctx.program_id);

    
    if let Err(error) = agnostic_orderbook::instruction::create_market::process::<BasicCallBack>(
        ctx.program_id,
        invoke_accounts,
        invoke_params,
    ) {
        msg!("{}", error);
        return Err(error!(CustomErrors::InvalidMarket))
    }

    */
    

    
    
    Ok(())


}