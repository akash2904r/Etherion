import { Utils } from "alchemy-sdk";
 
export default function getTxData(gasUsed, baseFeePerGas, maxFeePerGas, priorityFee) {
    gasUsed = BigInt(gasUsed._hex);
    baseFeePerGas = BigInt(baseFeePerGas);
    priorityFee = BigInt(priorityFee._hex);
    maxFeePerGas = BigInt(maxFeePerGas._hex);

    const burntFeeInWei = gasUsed * baseFeePerGas;
    const burntFeeInETH = Utils.formatEther(burntFeeInWei);

    const txSavingsInWei = gasUsed * (maxFeePerGas - (baseFeePerGas + priorityFee));
    const txSavingsInETH = Utils.formatEther(txSavingsInWei);

    return {
        burntFee: burntFeeInETH,
        txSavings: txSavingsInETH,
        baseFeePerGas: Utils.formatUnits(baseFeePerGas, 9)
    };
}