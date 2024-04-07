"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Transaction = /** @class */ (function () {
    function Transaction() {
        this.items = [];
        this.paidAmounts = [];
    }
    return Transaction;
}());
function parseItems(itemsString) {
    return itemsString.trim().split(';');
}
function parsePaidAmounts(paidAmountString) {
    return paidAmountString.split('-').map(function (part) {
        var match = part.match(/R(\d+)/);
        return match ? parseInt(match[1]) : 0;
    });
}
function calculateTransactionCost(items) {
    return items.reduce(function (acc, item) {
        var match = item.match(/R(\d+)/);
        return match ? acc + parseInt(match[1]) : acc;
    }, 0);
}
function main() {
    try {
        var lines = fs.readFileSync("input.txt", "utf-8").split('\n');
        var transactions = lines.map(function (line) {
            var _a = line.split(','), itemsString = _a[0], paidAmountString = _a[1];
            var transaction = new Transaction();
            transaction.items = parseItems(itemsString);
            transaction.paidAmounts = parsePaidAmounts(paidAmountString);
            return transaction;
        });
        var results_1 = [];
        var tillStartAmount_1 = 500;
        transactions.forEach(function (transaction) {
            var totalTransactionCost = calculateTransactionCost(transaction.items);
            var totalPaid = transaction.paidAmounts.reduce(function (acc, amount) { return acc + amount; }, 0);
            var totalChange = totalPaid - totalTransactionCost;
            var changeGiven = { 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0 };
            var remainingChange = totalChange;
            Object.keys(changeGiven).sort(function (a, b) { return parseInt(b) - parseInt(a); }).forEach(function (denomination) {
                var denom = parseInt(denomination);
                while (remainingChange >= denom) {
                    remainingChange -= denom;
                    changeGiven[denom]++;
                }
            });
            var changeBreakdown = Object.entries(changeGiven)
                .filter(function (_a) {
                var _ = _a[0], value = _a[1];
                return value > 0;
            })
                .flatMap(function (_a) {
                var key = _a[0], value = _a[1];
                return Array(value).fill(parseInt(key));
            })
                .map(function (amount) { return "R".concat(amount); })
                .join("-");
            var transactionResult = "R".concat(tillStartAmount_1, ", R").concat(totalTransactionCost, ", R").concat(totalPaid, ", R").concat(totalChange, ", ").concat(changeBreakdown);
            results_1.push(transactionResult);
            tillStartAmount_1 += totalTransactionCost;
        });
        results_1.push("R".concat(tillStartAmount_1));
        var header = "Till Start, Transaction Total, Paid, Change Total, Change Breakdown";
        results_1.unshift(header);
        fs.writeFileSync("output.txt", results_1.join('\n'));
    }
    catch (error) {
        console.error("An error occurred:", error);
    }
}
main();
