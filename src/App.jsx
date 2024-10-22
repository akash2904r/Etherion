import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { FaEthereum } from "react-icons/fa";

import { Navbar } from "./components";
import { 
  Home, 
  Address, 
  Block, 
  Transaction, 
  NotFound, 
  Transactions 
} from "./pages";

import { alchemy } from "./constants";
import { toGwei } from "./utils/formatter";

function App() {
  const [gas, setGas] = useState();

  useEffect(() => {
    async function getGasPrice() {
      setGas(Number((await alchemy.core.getGasPrice())._hex));
    }

    getGasPrice();
  }, [])

  return (
    <>
      <BrowserRouter>
        <div className='sticky top-0 z-10 flex items-center justify-between bg-dark-1 text-white font-poppins py-1.5 px-8 border-b-[1px] border-dark-2'>
          <div className="pr-3 text-sm">
            <span className="pr-3">
              <span>ETH Price:&nbsp;</span>
              <span className="text-blue-1">$x</span>
            </span>
            {gas && (
              <span>
                <span>Gas:&nbsp;</span> 
                <span className="text-blue-1">{ toGwei(gas, true) } Gwei</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-medium text-xs px-1.5 py-1 outline outline-1 outline-dark-2 bg-dark-2/20 rounded-sm">Mainnet</span>
            <span className="px-2 py-2 outline outline-1 outline-dark-2 bg-dark-2/20 rounded-sm"><FaEthereum /></span>
          </div>
        </div>

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/block/:blockData" element={<Block />} />
          <Route path="/address/:address" element={<Address />} />
          <Route path="/tx/:txHash" element={<Transaction />} />
          <Route path="/txs" element={<Transactions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      
        <footer></footer>
      </BrowserRouter>
    </>
  );
}

export default App;
