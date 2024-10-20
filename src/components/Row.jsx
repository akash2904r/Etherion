import { PiCube } from "react-icons/pi";
import { TbNotes } from "react-icons/tb";

import _ago from "../utils/_ago";
import { address, hash, toEther } from "../utils/formatter";

function Row({ blockInfo, latest, txInfo, timestamp, navigate }) {
    return (
        <li className={`flex items-center py-4 ${!(blockInfo?.isLast || txInfo?.isLast) && "border-b-[1px] border-dark-2"}`}>
            <div className="w-1/3 flex items-center gap-2 text-sm">
                <span className="text-2xl text-dark-5 p-2.5 bg-dark-3 rounded-lg">{latest === "Blocks" ? <PiCube /> : <TbNotes />}</span>
                <div>
                    {latest === "Blocks" ? (
                        <div 
                            className="text-blue-1 hover:text-blue-300 cursor-pointer"
                            onClick={() => navigate(`/block/${blockInfo.number}`)}
                        >{blockInfo.number}</div>
                    ) : (
                        <div 
                            className="text-blue-1 hover:text-blue-300 cursor-pointer"
                            onClick={() => navigate(`/tx/${txInfo.hash}`)}
                        >{hash(txInfo.hash)}</div>
                    )}
                    <div className="text-dark-5">{_ago(timestamp)}</div>
                </div>
            </div>
            <div className="w-2/3 flex justify-between">
                {latest === "Blocks" ? (
                    <span className="text-sm">
                        <div className="font-medium">
                            Fee Recipient&nbsp;
                            <span 
                                className="text-blue-1 hover:text-blue-300 cursor-pointer font-normal"
                                onClick={() => navigate(`/address/${blockInfo.miner}`)}
                            >{address(blockInfo.miner)}</span>
                        </div>
                        <span 
                            className="text-blue-1 hover:text-blue-300 cursor-pointer"
                            onClick={() => navigate(`/txs?block=${blockInfo.number}`)}
                        >{blockInfo.txCount} txns</span>
                    </span>
                ) : (
                    <>
                        <span className="text-sm">
                            <div className="font-medium">
                                From:&nbsp;
                                <span 
                                    className="font-normal text-blue-1 hover:text-blue-300 cursor-pointer"
                                    onClick={() => navigate(`/address/${txInfo.from}`)}
                                >{address(txInfo.from)}</span>
                            </div>
                            <div className="font-medium">
                                To:&nbsp;
                                <span 
                                    className="font-normal text-blue-1 hover:text-blue-300 cursor-pointer"
                                    onClick={() => navigate(`/address/${txInfo.to}`)}
                                >{address(txInfo.to)}</span>
                            </div>
                        </span>
                        <span className="h-fit w-fit text-xs border border-dark-2 px-1.5 py-1 rounded-md">{toEther(txInfo.amount)} Eth</span>
                    </>
                )}
            </div>
        </li>
    );
}

export default Row;
