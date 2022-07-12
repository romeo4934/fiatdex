use anchor_lang::prelude::*;

use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::consts::*;
use crate::error::CustomErrors;
use crate::program_accounts::*;


#[derive(Accounts)]
pub struct NewMakerOrder<'info> {
    pub user: Signer<'info>,

    pub base_vault: Account<'info, TokenAccount>,
    // Programs
    pub token_program: Program<'info, Token>,
}