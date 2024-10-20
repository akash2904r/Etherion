import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { FaEthereum, FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { MdAccessTime } from "react-icons/md";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

import getTxData from "../utils/tx";
import { alchemy } from "../constants";
import { extraData, gasPrice, timestamp, toEther, toGwei } from "../utils/formatter";

function Info({ 
    about, value, details, showDetails = false,
    isValue = false, top = false, bottom = false, 
    status = false, timestamp = false, burnt = false, gasFee = false
}) {
    return (
        <li className={`flex items-center text-[15px] text-dark-5 py-2 ${top ? "border-t-[1px] border-dark-2 mt-2.5 pt-4" : bottom ? "border-b-[1px] border-dark-2 mb-2.5 pb-4" : ""}`}>
            <span className="w-1/4 flex items-center gap-1.5">
                <HiOutlineQuestionMarkCircle />
                <span>{about}:</span>
            </span>

            {isValue ? (
                <span className="w-3/4 flex items-center gap-1 text-white/90">
                <FaEthereum />
                <span>{value} ETH</span>
            </span>
            ) : timestamp ? (
                <span className="w-3/4 flex items-center gap-1 text-white/90">
                    <MdAccessTime />
                    <span>{value}</span>
                </span>
            ) : status ? (
                <span className={`w-fit px-1.5 py-1 flex items-center gap-1 text-[11px] font-poppins border rounded-md ${value === 1 ? "text-green-500/80 border-green-500/80" : "text-red-500/70 border-red-500/70"}`}>
                    {value === 1 ? <FaCheckCircle /> : <IoMdCloseCircle />}
                    <span>{value === 1 ? "Success" : "Failure"}</span>
                </span>
            ) : gasFee ? (
                <span className="space-x-3">
                    <span>
                        <span>Base: </span>
                        <span className="text-white/90">{value.base} Gwei</span>
                    </span>
                    <span>|</span>
                    <span>
                        <span>Max: </span>
                        <span className="text-white/90">{toGwei(value.max)} Gwei</span>
                    </span>
                    <span>|</span>
                    <span>
                        <span>Max Priority: </span>
                        <span className="text-white/90">{toGwei(value.priority)} Gwei</span>
                    </span>
                </span>
            ) : burnt ? (
                <span className="text-[11px] font-medium space-x-3">
                    <span className="border border-dark-5/60 rounded-md px-1.5 py-[3px]">
                        <span>🔥 Burnt: </span>
                        <span className="text-white/90">{value.burnt} ETH</span>
                    </span>
                    <span className="border border-dark-5/60 rounded-md px-1.5 py-[3px]">
                        <span>💸 Txn savings: </span>
                        <span className="text-white/90">{value.saved} ETH</span>
                    </span>
                </span>
            ) : showDetails ? (
                <span 
                    className="max-w-3/4 w-fit text-blue-1 hover:text-blue-300 cursor-pointer"
                    onClick={() => details?.isNumber 
                        ? details?.navigate(`/block/${value}`)
                        : details?.navigate(`/address/${value}`)
                    }
                >{value}</span>
            ) : (
                <span className="w-3/4 text-white/90">{value}</span>
            )}
        </li>
    );
}

function Transaction() {
    const navigate = useNavigate();
    const { txHash } = useParams();

    const [txInfo, setTxInfo] = useState();
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        async function getTxInfo() {
            const tx = await alchemy.core.getTransaction(txHash);

            const promises = [
                await alchemy.core.getBlock(tx.blockNumber),
                await alchemy.core.getTransactionReceipt(txHash)
            ]
            const [block, txReceipt] = await Promise.all(promises);
            const txData = getTxData(txReceipt.gasUsed, block.baseFeePerGas, tx.maxFeePerGas, tx.maxPriorityFeePerGas);

            setTxInfo({ 
                ...tx, 
                ...txData, 
                status: txReceipt.status, 
                timestamp: timestamp(block.timestamp, true)
            });
        }

        if (txHash) {
            getTxInfo();
        }
    }, [txHash])

    console.log(txInfo, extraData(txInfo.data))

    return (
        <main className="px-5 bg-dark-3 pb-20">
            <h3 className="text-xl text-white font-medium pt-4 pb-5 border-b-[1px] border-dark-2">Transaction Details</h3>

            {txInfo && (
                <>
                    <ul className="mt-10 px-4 py-2 bg-dark-4 border border-dark-2 rounded-lg">
                        <Info about="Transaction Hash" value={txInfo.hash} />
                        <Info status about="Status" value={txInfo.status} />
                        <Info 
                            showDetails
                            about="Block" 
                            value={txInfo.blockNumber} 
                            details={{ isNumber: true, navigate }} 
                        />
                        <Info timestamp about="Timestamp" value={txInfo.timestamp} />
                        <Info top showDetails about="From" value={txInfo.from} />
                        <Info bottom showDetails about="To" value={txInfo.to} />
                        <Info 
                            isValue
                            about="Value" 
                            value={toEther(txInfo.value._hex, false)} 
                        />
                        <Info about="Gas Price" value={gasPrice(txInfo.gasPrice._hex)} />
                    </ul>

                    <div className="mt-4 p-4 bg-dark-4 border border-dark-2 rounded-lg">
                        {showMore && (
                            <ul className="pb-4 mb-4 border-b-[1px] border-dark-2">
                                <Info about="Gas Limit" value={BigInt(txInfo.gasLimit._hex).toLocaleString()} />
                                <Info 
                                    gasFee
                                    about="Gas Fees" 
                                    value={{ base: txInfo.baseFeePerGas, max: txInfo.maxFeePerGas, priority: txInfo.maxPriorityFeePerGas }} 
                                />
                                <Info 
                                    burnt 
                                    bottom
                                    about="Burnt & Txn Savings Fees" 
                                    value={{ burnt: txInfo.burntFee, saved: txInfo.txSavings }} 
                                />
                            </ul>
                        )}
                        <div 
                            className={`flex items-center text-[15px] bg-dark-4 text-white cursor-pointer ${showMore && "transition-all duration-[10s] ease-in-out"}`}
                            onClick={() => setShowMore(prev => !prev)}
                        >
                            <span className="w-1/4">More Details:</span>
                            <span className="w-3/4 flex items-center gap-1.5 text-blue-1 hover:text-blue-300">
                                {showMore ? <FaMinus className="text-[13px]" /> : <FaPlus className="text-[13px]" />}
                                <span>Click to show {showMore ? "less" : "more"}</span>
                            </span>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}

export default Transaction;
