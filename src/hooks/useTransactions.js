import { useState, useEffect } from "react";

import { alchemy } from "../constants";

const PAGE_SIZE = 25;
const BATCH_SIZE = 100;

const getAssetTransfers = (address, pageKey = null, direction = 'fromAddress') => {
    const params = {
        [direction]: address,
        category: ['external'],
        order: 'desc',
        maxCount: BATCH_SIZE,
        withMetadata: true,
        excludeZeroValue: false
    };
    
    if (pageKey) {
        params.pageKey = pageKey;
    }
  
    return alchemy.core.getAssetTransfers(params);
}

function useTransactions(address) {
    const [transactions, setTransactions] = useState([]);
    const [txnsCount, setTxnsCount] = useState(null);
    const [pageKeys, setPageKeys] = useState({ from: null, to: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            // Get sent and received transactions in parallel
            const txs = [
                getAssetTransfers(address, pageKeys.from),
                getAssetTransfers(address, pageKeys.to, 'toAddress'),
                alchemy.core.getTransactionCount(address)
            ];
            const [sentTxs, receivedTxs, txCount] = await Promise.all(txs);
    
            // Merge and sort transactions by block timestamp
            let combinedTxs = [...sentTxs.transfers, ...receivedTxs.transfers];
            combinedTxs.sort((a, b) => new Date(b.metadata.blockTimestamp).getTime() - new Date(a.metadata.blockTimestamp).getTime());

            // Remove duplicates by transaction hash
            const seenHashes = new Set();
            combinedTxs = combinedTxs.filter(tx => {
                if (seenHashes.has(tx.hash)) return false;
                seenHashes.add(tx.hash);
                return true;
            });
    
            setTransactions(combinedTxs);
            setTxnsCount(txCount);
            setPageKeys({
                from: sentTxs.pageKey ?? null,
                to: receivedTxs.pageKey ?? null,
            });
        } catch (error) {
            setError('Failed to load transactions. Please try again later.');
            console.error('Error fetching transactions: ', error);
        } finally {
            setLoading(false);
        }
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        const totalLoadedPages = Math.ceil(transactions.length / PAGE_SIZE);
        if (newPage > totalLoadedPages) {
            fetchTransactions();
        }
    }
    
    useEffect(() => {
        fetchTransactions();
    }, [address]);

    const displayedTransactions = transactions.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return ({
        transactions: displayedTransactions,
        currentPage,
        loading,
        error,
        totalPages: Math.ceil(txnsCount / PAGE_SIZE),
        totalTxns: txnsCount,
        handlePageChange,
    });
}

export default useTransactions;