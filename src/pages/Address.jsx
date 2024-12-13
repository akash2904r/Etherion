import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { FaEthereum } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { LuArrowDownWideNarrow } from "react-icons/lu";

import { Table } from "../components";

import { alchemy } from "../constants";
import { toEther } from "../utils/formatter";

function Address() {
    const navigate = useNavigate();
    const { address } = useParams();

    const [addInfo, setAddInfo] = useState();
    const [showing, setShowing] = useState("Txs");

    useEffect(() => {
        async function addressInfo() {
            const promises = [
                await alchemy.core.getBalance(address, "latest"),
                await alchemy.core.getTransactionCount(address),
                await alchemy.core.getAssetTransfers({
                    fromBlock: '0x0',
                    toBlock: "latest",
                    fromAddress: address,
                    category: ['external'],
                    order: 'desc',
                    excludeZeroValue: true,
                    maxCount: 25, 
                }),
                // await alchemy.core.getAssetTransfers({
                //     fromBlock: '0x0',
                //     toBlock: "latest",
                //     fromAddress: address,
                //     category: ['internal'],
                //     order: 'desc',
                //     excludeZeroValue: true,
                //     maxCount: 25, 
                // }),
                await alchemy.core.getAssetTransfers({
                    fromBlock: '0x0',
                    toBlock: "latest",
                    fromAddress: address,
                    category: ['external'],
                    order: 'asc',
                    excludeZeroValue: true,
                    maxCount: 1, 
                })
            ]

            const [balance, txCount, externalTx, /* internalTx, */ firstTx] = await Promise.all(promises);

            setAddInfo({
                balance: Number(toEther(balance._hex, false)),
                tx: {
                    count: txCount,
                    external: externalTx.transfers,
                    // internal: internalTx.transfers,
                    first: firstTx.transfers[0]
                }
            });

            console.log(balance, txCount, externalTx, /* internalTx, */ firstTx)
        }

        if (address) {
            addressInfo();
        }
    }, [address])

    console.log(addInfo)

    return (
        addInfo && (
        <main className="px-5 bg-dark-3 pb-20">
            <h3 className="flex items-baseline gap-2 text-xl px-2 pt-4 pb-5 border-b-[1px] border-dark-2 text-white">
                <span className="font-medium">Address</span>
                <span className="text-base">{address}</span>
            </h3>

            <div className="flex items-center gap-5 text-white text-sm font-poppins mt-10">
                <div className="w-1/3 bg-dark-1 border border-dark-2 rounded-lg px-4 py-3">
                    <div className="font-medium">Overview</div>
                    <div className="uppercase text-dark-5 text-[13px] mt-2.5">eth balance</div>
                    <div className="flex items-center">
                        <FaEthereum />
                        <span>{addInfo?.balance} ETH</span>
                    </div>
                </div>
                <div className="w-1/3 bg-dark-1 border border-dark-2 rounded-lg px-4 py-3">
                    <div className="font-medium">More Info</div>
                    <div className="uppercase text-dark-5 text-[13px] mt-2.5">trasactions sent</div>
                    <div className="flex items-center gap-5">
                        <span className="flex items-center">
                            <span className="text-dark-5">Latest:&nbsp;</span>
                            <span 
                                className="cursor-pointer hover:text-blue-400/80"
                                onClick={() => navigate(`/tx/${addInfo.tx.external[0].hash}`)}
                            >{addInfo?.tx?.external[0]?.hash.slice(0, 9)}...</span>
                        </span>
                        <span className="flex items-center">
                            <span className="text-dark-5">First:&nbsp;</span>
                            <span 
                                className="cursor-pointer hover:text-blue-400/80"
                                onClick={() => navigate(`/tx/${addInfo.tx.first.hash}`)}
                            >{addInfo?.tx?.first?.hash.slice(0, 9)}...</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="text-white/90 font-poppins space-x-3 mt-8 mb-4">
                <span 
                    className={`text-xs font-medium px-2 py-1.5 rounded-lg ${showing === "Txs" ? "bg-blue-400/80" : "bg-dark-2/50 hover:bg-dark-2"} cursor-pointer`}
                    onClick={() => showing !== "Txs" && setShowing("Txs")}
                >Transactions</span>
                <span 
                    className={`text-xs font-medium px-2 py-1.5 rounded-lg ${showing === "iTxs" ? "bg-blue-400/80" : "bg-dark-2/50 hover:bg-dark-2"} cursor-pointer`}
                    onClick={() => showing !== "iTxs" && setShowing("iTxs")}
                >Internal Transactions</span>
            </div>

            {addInfo.tx.external.length ? (
                <>
                    <div className="flex items-center gap-1 bg-dark-1 text-white px-5 pt-4 pb-4 border-t-[1px] border-x-[1px] border-dark-2 rounded-t-xl">
                        <LuArrowDownWideNarrow />
                        <span className="text-[15px]">
                            <span>Latest {addInfo?.tx?.external.length < 25 ? addInfo?.tx?.external.length : "25"} from a total of&nbsp;</span>
                            <span 
                                className="text-blue-1 hover:text-blue-300 cursor-pointer"
                                onClick={() => navigate(`/txs?a=${address}`)}
                            >{addInfo?.tx?.count.toLocaleString()}&nbsp;</span>
                            <span>transactions</span>
                        </span>
                    </div>
                    <Table>
                        {addInfo.tx.external.map(tx => (
                            <Table.Row
                                txHash={tx.hash}
                                blockNo={Number(tx.blockNum)}
                                from={tx.from}
                                isIn={tx.to == address}
                                to={tx.to}
                                amount={tx.value}
                            />
                        ))}
                    </Table>
                </>
            ) : (
                <Table.NoEntries />
            )}

            {addInfo.tx.count > 25 && (
                <div 
                    className="flex justify-center items-center gap-1 uppercase text-sm text-dark-5 hover:text-blue-1 p-3 border-x-[1px] border-b-[1px] border-dark-2 bg-dark-6 rounded-b-xl cursor-pointer"
                    onClick={() => navigate(`/txs?a=${address}`)}
                >
                    <span>View all transactions</span>
                    <FaArrowRightLong />
                </div>
            )}
        </main>
    ));
}

export default Address;
