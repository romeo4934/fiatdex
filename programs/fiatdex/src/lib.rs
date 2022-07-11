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

    pub fn init_open_orders(_ctx: Context<Initialize>) -> Result<()> {
        Err(error!(CustomErrors::NotImplemented))
        // Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
