import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"

import { FaPlus, FaMinus } from "react-icons/fa6";
import { MdAccessTime } from "react-icons/md";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";

import _ago from "../utils/_ago";
import { alchemy } from "../constants";
import { baseFeePerGas, extraData, timestamp } from "../utils/formatter";

function Info({ about, value, isTimestamp = false, showDetails = false, details }) {
    return (
        <li className="flex items-center text-[15px] text-dark-5 py-2">
            <span className="w-1/4 flex items-center gap-1.5">
                <HiOutlineQuestionMarkCircle />
                <span>{about}:</span>
            </span>

            {isTimestamp ? (
                <span className="w-3/4 flex items-center gap-1 text-white/90">
                    <MdAccessTime />
                    <span>{value}</span>
                </span>
            ) : showDetails ? (
                <span 
                    className="max-w-3/4 w-fit text-blue-1 hover:text-blue-300 cursor-pointer"
                    onClick={() => details?.number 
                        ? details?.navigate(`/txs?block=${details?.number}`)
                        : details?.hash 
                            ? details?.navigate(`/block/${details?.hash}`)
                            : details?.navigate(`/address/${value}`)
                    }
                >{value}</span>
            ) : (
                <span className="w-3/4 text-white/90">{value}</span>
            )}
        </li>
    );
}

function Block() {
    const navigate = useNavigate();
    const { blockData } = useParams();

    const [blockInfo, setBlockInfo] = useState();
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        async function getBlockInfo() {
            setBlockInfo(await alchemy.core.getBlock(
                blockData.startsWith("0x") ? blockData : Number(blockData)
            ));
        }

        if (blockData) {
            getBlockInfo();
        }
    }, [blockData])

    return (
        <main className="px-5 bg-dark-3 pb-20">
            <h3 className="flex items-center gap-2 text-xl pt-4 pb-5 border-b-[1px] border-dark-2">
                <span className="text-white font-medium">Block</span>
                <span className="text-sm text-dark-5">#{blockData}</span>
            </h3>

            {blockInfo && (
                <>
                    <ul className="mt-10 px-4 py-2 bg-dark-4 border border-dark-2 rounded-lg">
                        <Info about="Block Height" value={blockInfo?.number} />
                        <Info about="Timestamp" value={timestamp(blockInfo?.timestamp)} isTimestamp />
                        <Info 
                            showDetails 
                            about="Transactions" 
                            value={`${blockInfo?.transactions.length} transactions`} 
                            details={{ navigate, number: blockInfo?.number }} 
                        />
                        <Info 
                            showDetails 
                            about="Fee Recipient" 
                            value={blockInfo?.miner} 
                            details={{ navigate }} 
                        />
                        <Info about="Total Difficulty" value={blockInfo?.difficulty} />
                        <Info about="Gas Used" value={Number(blockInfo?.gasUsed?._hex)} />
                        <Info about="Gas Limit" value={Number(blockInfo?.gasLimit?._hex)} />
                        <Info about="Base Fee Per Gas" value={baseFeePerGas(blockInfo?.baseFeePerGas?._hex)} />
                        <Info about="Extra Data" value={extraData(blockInfo?.extraData)} />
                    </ul>

                    <div className="mt-4 p-4 bg-dark-4 border border-dark-2 rounded-lg">
                        {showMore && (
                            <ul className="pb-4 mb-4 border-b-[1px] border-dark-2">
                                <Info about="Hash" value={blockInfo?.hash} />
                                <Info 
                                    showDetails 
                                    about="Parent Hash" 
                                    value={blockInfo?.parentHash} 
                                    details={{ navigate, hash: blockInfo?.parentHash }}
                                />
                                <Info about="Nonce" value={blockInfo?.nonce} />
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

export default Block;
