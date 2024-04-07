import * as fs from 'fs';

class Transaction {
    public items: string[];
    public paidAmounts: number[];

    constructor() {
        this.items = [];
        this.paidAmounts = [];
    }
}

function parseItems(itemsString: string): string[] {
    return itemsString.trim().split(';');
}

function parsePaidAmounts(paidAmountString: string): number[] {
    return paidAmountString.split('-').map(part => {
        const match = part.match(/R(\d+)/);
        return match ? parseInt(match[1]) : 0;
    });
}

function calculateTransactionCost(items: string[]): number {
    return items.reduce((acc, item) => {
        const match = item.match(/R(\d+)/);
        return match ? acc + parseInt(match[1]) : acc;
    }, 0);
}

function main() {
    try {
        const lines: string[] = fs.readFileSync("input.txt", "utf-8").split('\n');

        const transactions: Transaction[] = lines.map((line: string) => {
            const [itemsString, paidAmountString] = line.split(',');
            const transaction = new Transaction();
            transaction.items = parseItems(itemsString);
            transaction.paidAmounts = parsePaidAmounts(paidAmountString);
            return transaction;
        });

        const results: string[] = [];
        let tillStartAmount: number = 500;
        transactions.forEach((transaction) => {
            const totalTransactionCost = calculateTransactionCost(transaction.items);
            const totalPaid = transaction.paidAmounts.reduce((acc, amount) => acc + amount, 0);
            const totalChange = totalPaid - totalTransactionCost; 

            const changeGiven: { [key: number]: number } = { 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0 };

            let remainingChange = totalChange;
            Object.keys(changeGiven).sort((a, b) => parseInt(b) - parseInt(a)).forEach((denomination) => {
                const denom: number = parseInt(denomination);
                while (remainingChange >= denom) {
                    remainingChange -= denom;
                    changeGiven[denom]++;
                }
            });

            const changeBreakdown: string = Object.entries(changeGiven)
                .filter(([_, value]) => value > 0)
                .flatMap(([key, value]) => Array(value).fill(parseInt(key)))
                .map(amount => `R${amount}`)
                .join("-");

            const transactionResult: string = `R${tillStartAmount}, R${totalTransactionCost}, R${totalPaid}, R${totalChange}, ${changeBreakdown}`;
            results.push(transactionResult);

            tillStartAmount += totalTransactionCost;
        });

        results.push(`R${tillStartAmount}`);

        const header: string = "Till Start, Transaction Total, Paid, Change Total, Change Breakdown";
        results.unshift(header);
        
        fs.writeFileSync("output.txt", results.join('\n'));
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();
