import { FaRegCopy } from "react-icons/fa6";

import { hash, address } from "../utils/formatter";

function Table({ children }) {
    return (
        <table className="w-full bg-dark-1 text-white border-x-[1px] border-dark-2">
            <thead className="border-b-[1px] border-dark-2 px-5">
                <tr className="text-sm">
                    <th className="py-2.5">Transaction Hash</th>
                    <th className="py-2.5">Block</th>
                    <th className="py-2.5">From</th>
                    <th className="py-2.5"></th>
                    <th className="py-2.5">To</th>
                    <th className="py-2.5">Amount</th>
                </tr>
            </thead>

            <tbody className="border-spacing-5">
                {children}
            </tbody>
        </table>
    );
}

function Row({ txHash, blockNo, from, isIn, to, amount }) {
    const copy = (data) => navigator.clipboard.writeText(data);

    return (
        <tr className="text-sm border-b-[1px] border-dark-2 text-blue-1">
            <td className="flex justify-center items-center gap-2.5 py-3">
                <span className="hover:text-blue-300 cursor-pointer">{hash(txHash)}</span>
                <span
                    className="text-dark-5 hover:text-blue-500 cursor-pointer"
                    onClick={() => copy(txHash)}
                ><FaRegCopy /></span>
            </td>
            <td className="py-3 text-center">
                <span className="hover:text-blue-300 cursor-pointer">{blockNo}</span>
            </td>
            <td className="flex justify-center items-center gap-2.5 py-3">
                <span className={`${isIn ? "hover:text-blue-300 cursor-pointer" : "text-white"}`}>{address(from)}</span>
                <span
                    className="text-dark-5 hover:text-blue-500 cursor-pointer" 
                    onClick={() => copy(from)}
                ><FaRegCopy /></span>
            </td>
            <td className="py-3 text-center">
                {isIn ? (
                    <span className="px-3 py-[3px] text-[10px] text-green-500 font-bold border border-green-500/70 bg-green-700/20 rounded-md">IN</span>
                ) : (
                    <span className="px-1.5 py-[3px] text-[10px] text-yellow-500 font-bold border border-yellow-500/70 bg-yellow-500/20 rounded-md">OUT</span>
                )}
            </td>
            <td className="flex justify-center items-center gap-2.5 py-3">
                <span className={`${!isIn ? "hover:text-blue-300 cursor-pointer" : "text-white"}`}>{address(to)}</span>
                <span
                    className="text-dark-5 hover:text-blue-500 cursor-pointer" 
                    onClick={() => copy(to)}
                ><FaRegCopy /></span>
            </td>
            <td className="py-3 text-center">
                <span className="text-white">{amount} ETH</span>
            </td>
        </tr>
    );
}

Table.Row = Row;

export default Table;
