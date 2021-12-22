import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { api } from '../services/api';

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    createdAt: number;
    category: string;
}

interface TransactionsProviderProps {
    children: ReactNode
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionsContextData {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TranscationsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
);

export function TransactionsProvider({ children } : TransactionsProviderProps){

    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() =>{
        api.get('/transactions')
            .then(response => setTransactions(response.data.transactions))
    },[])

    async function createTransaction(transactionInput: TransactionInput){
       const response = await api.post('/transactions', {
           ...transactionInput,
           createdAt: new Date(),
       })
       const { transaction } =  response.data;

       setTransactions([
           ...transactions,
           transaction,
       ]);
    }

    return (
        <TranscationsContext.Provider value={{ transactions , createTransaction}}>
            { children }
        </TranscationsContext.Provider>
    )

}


export function useTransaction(){
    const context = useContext(TranscationsContext)

    return context;
}