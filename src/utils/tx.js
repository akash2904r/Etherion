import { Utils } from "alchemy-sdk";

const min = (a, b) => a < b ? a : b;
 
export default function getTxData(gasUsed, baseFeePerGas, maxFeePerGas, priorityFee) {
    gasUsed = BigInt(gasUsed._hex);
    baseFeePerGas = BigInt(baseFeePerGas);
    priorityFee = BigInt(priorityFee._hex);
    maxFeePerGas = BigInt(maxFeePerGas._hex);

    const burntFeeInWei = gasUsed * baseFeePerGas;
    const burntFeeInETH = Utils.formatEther(burntFeeInWei);

    const txSavingsInWei = gasUsed * (maxFeePerGas - (baseFeePerGas + priorityFee));
    const txSavingsInETH = Utils.formatEther(txSavingsInWei);

    const txFeeInWei = gasUsed * min(maxFeePerGas, baseFeePerGas + priorityFee);
    const txFeeInETH = Utils.formatEther(txFeeInWei);

    return {
        txFee: txFeeInETH,
        burntFee: burntFeeInETH,
        txSavings: txSavingsInETH,
        baseFeePerGas: Utils.formatUnits(baseFeePerGas, 9)
    };
}