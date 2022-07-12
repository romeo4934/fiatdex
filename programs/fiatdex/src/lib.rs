use anchor_lang::prelude::*;

use agnostic_orderbook::state::Side;

use instructions::*;
use program_accounts::*;
use error::*;

mod consts;
mod error;
pub mod program_accounts;
pub mod instructions;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod fiatdex {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let this = Side::Ask;
        /*
        let alice = [1; 32];
        let invoke_params = agnostic_orderbook::instruction::new_order::Params {
            max_base_qty: 50_000,
            max_quote_qty: 1_000_000_000,
            limit_price: 15 << 32,
            side: Side::Bid,
            match_limit: 10,
            callback_info: alice,
            post_only: false,
            post_allowed: true,
            self_trade_behavior: SelfTradeBehavior::AbortTransaction,
        };
        */
        
        match this {
            Side::Bid => {
                msg!("hey it's a bid");
            }
            Side::Ask => {
                msg!("hey it's an ask");
            }
        }
        Ok(())
    }

    pub fn init_market(_ctx: Context<Initialize>) -> Result<()> {
        Err(error!(CustomErrors::NotImplemented))
        // Ok(())
    }

    pub fn new_maker_order(_ctx: Context<Initialize>) -> Result<()> {
        Err(error!(CustomErrors::NotImplemented))
        // Ok(())
    }

    pub fn new_taker_order(_ctx: Context<Initialize>) -> Result<()> {
        Err(error!(CustomErrors::NotImplemented))
        // Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
