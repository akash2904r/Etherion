import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

import Row from "./Row";
import _ago from "../utils/_ago";
import { alchemy } from "../constants";

function Details({ latest }) {
    const navigate = useNavigate();
    const [blockInfo, setBlockInfo] = useState();

    useEffect(() => {
        async function getBlockInfo() {
            if (latest === "Blocks") {
                const latestBlock = await alchemy.core.getBlockNumber();
                const latestBlocks = new Array(6).fill(0).map((_, i) => latestBlock - i);
                const promises = latestBlocks.map(async (blockNo) => await alchemy.core.getBlock(blockNo));

                setBlockInfo(await Promise.all(promises));
            } else {
                setBlockInfo(await alchemy.core.getBlockWithTransactions("latest"));
            }
        }

        getBlockInfo();
    }, []);

    return (
        <div className="w-[50%] text-white bg-dark-4 border border-dark-2 my-14 rounded-xl">
            <h4 className="font-medium p-3.5 border-dark-2 border-b-[1px]">Latest {latest}</h4>
            <ul className="px-5">
                {latest === "Blocks" ? (
                    blockInfo?.map((info, i) => (
                        <Row 
                            key={info?.number}
                            latest={latest}
                            blockInfo={{
                                number: info?.number,
                                miner: info?.miner,
                                txCount: info?.transactions?.length,
                                isLast: i !== 5 ? false : true
                            }}
                            timestamp={info?.timestamp}
                            navigate={navigate}
                        />
                    ))
                ) : (
                    blockInfo?.transactions.slice(0, 6).map((tx, i) => (
                        <Row 
                            key={tx.hash}
                            latest={latest}
                            txInfo={{
                                hash: tx.hash,
                                from: tx.from,
                                to: tx.to,
                                amount: tx?.value?._hex,
                                isLast: i !== 5 ? false : true
                            }}
                            timestamp={blockInfo?.timestamp}
                            navigate={navigate}
                        />
                    ))
                )}
            </ul>
            <div className="group/seeAll flex justify-center items-center gap-2 uppercase text-xs font-medium p-3.5 bg-dark-6 border-t-[1px] border-dark-2 cursor-pointer rounded-b-xl">
                <span className="text-dark-5 group-hover/seeAll:text-blue-300">View all {latest === "Blocks" ? latest : "Transactions"}</span>
                <FaArrowRightLong className="text-dark-5 group-hover/seeAll:text-blue-300" />
            </div>
        </div>
    )
}

export default Details;
