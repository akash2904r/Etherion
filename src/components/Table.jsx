import { useState } from "react";
import { BsInboxes } from "react-icons/bs";
import { FaRegCopy, FaCheck } from "react-icons/fa6";

import { hash, address } from "../utils/formatter";

function Table({ children, noEntries = false }) {
    return (
        <table className="w-full bg-dark-1 text-white border-x-[1px] border-dark-2">
            <thead className={`border-b-[1px] ${noEntries && "border-t-[1px]"} border-dark-2 px-5`}>
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
    const [copied, setCopied] = useState({
        hash: false, from: false, to: false
    });

    const copy = (data, name) => {
        setCopied(prev => ({ ...prev, [name]: true }));
        navigator.clipboard.writeText(data)
        setTimeout(() => setCopied(false), 750);
    };

    return (
        <tr className="text-sm border-b-[1px] border-dark-2 text-blue-1">
            <td className="flex justify-center items-center gap-2.5 py-3">
                <span className="hover:text-blue-300 cursor-pointer">{hash(txHash)}</span>
                <span
                    className="text-dark-5 hover:text-blue-500 cursor-pointer"
                    onClick={() => copy(txHash, "hash")}
                >
                    {copied.hash ? <FaCheck /> : <FaRegCopy />}
                </span>
            </td>
            <td className="py-3 text-center">
                <span className="hover:text-blue-300 cursor-pointer">{blockNo}</span>
            </td>
            <td className="flex justify-center items-center gap-2.5 py-3">
                <span className={`${isIn ? "hover:text-blue-300 cursor-pointer" : "text-white"}`}>{address(from)}</span>
                <span
                    className="text-dark-5 hover:text-blue-500 cursor-pointer" 
                    onClick={() => copy(from, "from")}
                >
                    {copied.from ? <FaCheck /> : <FaRegCopy />}
                </span>
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
                    onClick={() => copy(to, "to")}
                >
                    {copied.to ? <FaCheck /> : <FaRegCopy />}
                </span>
            </td>
            <td className="py-3 text-center">
                <span className="text-white">{amount} ETH</span>
            </td>
        </tr>
    );
}

function NoEntries() {
    return (
        <>
            <Table noEntries />
            <div className="flex flex-col gap-1.5 justify-center items-center py-28 bg-dark-1 border border-dark-2 border-t-transparent">
                <div className="px-3.5 py-3.5 rounded-full border border-yellow-500/70 bg-yellow-500/20">
                    <BsInboxes size={25} color="#eab308b3" />
                </div>
                <div className="text-white text-xl font-semibold">There are no matching entries</div>
                <div className="text-dark-5">Please try again later</div>
            </div>
        </>
    );
}

Table.Row = Row;
Table.NoEntries = NoEntries;

export default Table;
