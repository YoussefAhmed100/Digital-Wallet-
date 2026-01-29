import { ParsedTransaction } from "./parsed-transaction.type";

export interface IBankStrategy {
  
  
  parse(payload: string): ParsedTransaction;
}