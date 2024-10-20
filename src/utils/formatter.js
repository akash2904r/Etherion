import { Utils } from "alchemy-sdk";
import _ago from "./_ago";

export const address = (add) => `${add.slice(0, 10)}...${add.slice(-9)}`;

export const hash = (hash) => `${hash.slice(0, 13)}...`;

export const toEther = (amt, short = true) => short 
    ? parseFloat(Number(Utils.formatEther(BigInt(amt))).toFixed(6)) 
    : parseFloat(Number(Utils.formatUnits(BigInt(amt), "ether"))).toFixed(18);

export const toGwei = (amt, short = false) => short
    ? parseFloat(Number(Utils.formatUnits(BigInt(amt), "gwei"))).toFixed(3)
    : parseFloat(Number(Utils.formatUnits(BigInt(amt), "gwei")));

export const timestamp = (ts) => `${_ago(ts)} (${String(new Date(ts)).slice(0, 33)})`;

export const extraData = (data, onlyData = false) => onlyData
    ? Utils.toUtf8String(Utils.arrayify(data))
    : `${Utils.toUtf8String(Utils.arrayify(data))} (Hex: ${data})`;

export const baseFeePerGas = (amt) => `${toEther(amt, false)} ETH (${toGwei(amt)} Gwei)`;

export const gasPrice = (amt) => `${toGwei(amt)} Gwei (${toEther(amt, false)} ETH)`;