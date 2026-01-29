import { transactions } from '../transactions/schema/transactions.schema';
import { users } from '../users/schema/user.schema';
import {wallets} from '../wallet/schema/wallet.schema'

export const schema = {
  transactions,
  users,
  wallets
};

export type DbSchema = typeof schema;
