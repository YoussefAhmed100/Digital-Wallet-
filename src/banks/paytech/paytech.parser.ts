import { Injectable } from "@nestjs/common";

@Injectable()
export class PayTechParser {
    parseData(row:string){
        const lines=row.trim().split('\n');
        return lines.map((line)=>{
            const [dateAndAmount, reference, metadataRaw]=line.split('#');

            const date=dateAndAmount.slice(0,8);
            const amountRaw=dateAndAmount.slice(8).replace(',', '.');

            const metadataParts = metadataRaw.split('/');
            const metadata: Record<string, string> = {};

            for (let i = 0; i < metadataParts.length; i += 2) {
              metadata[metadataParts[i]] = metadataParts[i + 1];
            }

            return {
              reference,
              amount: Number(amountRaw),
              transactionDate: new Date(
                `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
              ),
              bank: 'PAYTECH',
              metadata,
            };
        })
    }
}