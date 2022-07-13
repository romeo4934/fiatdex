use anchor_lang::prelude::*;

use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::consts::*;
use crate::error::CustomErrors;
use crate::program_accounts::*;


#[derive(Accounts)]
pub struct NewTakerOrder<'info> {
    pub user: Signer<'info>,

    pub base_vault: Account<'info, TokenAccount>,
    // Programs
    pub token_program: Program<'info, Token>,
}

/*

    msg!("BOUBOUBOU: MIMIIIIIIIIII");
    msg!("BOUBOUBOU: {:?}",  ctx.program_id);
    msg!("BOUBOUBOU2: {:?}",  ctx.accounts.orderbook);
    //msg!("BOUBOUBOU2: {:?}",  ctx.accounts.market.to_account_info());

    //let space = EventQueue::<[u8; 32]>::compute_allocation_size(1000);

    // msg!("SPACE: {:?}",  space);
    msg!("MARKET SPACE: {:?}",  MarketState::LEN);

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