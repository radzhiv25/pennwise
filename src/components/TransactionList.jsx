import PropTypes from "prop-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction List</CardTitle>
        <CardDescription>
          View and manage your transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto space-y-3">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions yet. Add your first transaction above!</p>
          ) : (
            transactions.map((transaction, index) => (
              <Card key={index} className="border-l-4 border-l-green-500" style={{ borderLeftColor: transaction.type === 'income' ? '#10b981' : '#ef4444' }}>
                <CardContent className="pt-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                        <span className="text-xl font-bold">
                          {transaction.currency === 'USD' ? '$' : transaction.currency === 'GBP' ? '£' : '₹'}{transaction.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.date}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">Category:</span> {transaction.category}
                        </div>
                        {transaction.description && (
                          <div className="text-sm">
                            <span className="font-medium">Description:</span> {transaction.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(transaction)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(transaction)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TransactionList;