import { hash, address } from "../utils/formatter";

function Table({ children }) {
    return (
        <table className="w-full bg-dark-1 text-white border-x-[1px] border-dark-2">
            <thead className="border-b-[1px] border-dark-2 px-5">
                <tr className="text-sm py-2.5">
                    <th>Transaction Hash</th>
                    <th>Block</th>
                    <th>From</th>
                    <th></th>
                    <th>To</th>
                    <th>Amount</th>
                </tr>
            </thead>

            <tbody>
                {children}
            </tbody>
        </table>
    );
}

function Row({ txHash, blockNo, from, isIn, to, amount }) {
    return (
        <tr className="px-5">
            <td>{hash(txHash)}</td>
            <td>{blockNo}</td>
            <td>{address(from)}</td>
            <td>
                {isIn ? (
                    <span className="px-3 py-[3px] text-[10px] text-green-500 font-bold border border-green-500/70 bg-green-700/20 rounded-md">IN</span>
                ) : (
                    <span className="px-1.5 py-[3px] text-[10px] text-yellow-500 font-bold border border-yellow-500/70 bg-yellow-500/20 rounded-md">OUT</span>
                )}
            </td>
            <td>{address(to)}</td>
            <td>{amount} ETH</td>
        </tr>
    );
}

Table.Row = Row;

export default Table;
