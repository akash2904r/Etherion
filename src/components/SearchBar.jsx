import { useState } from "react";

import { BsSearch } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

function SearchBar() {
    const [isFocused, setIsFocused] = useState(false); 
    const [filter, setFilter] = useState("Block no.");
    const [search, setSearch] = useState("");

    return (
        <div className='w-[55%] px-1.5 py-1 flex items-center gap-1.5 border border-dark-2 bg-dark-4 rounded-md'>
            <div 
                tabIndex={0}
                className="w-[18%] relative flex justify-between items-center gap-2.5 text-white border-2 border-transparent focus:border-dark-2 transition-border duration-300 ease-in-out py-1 px-2.5 rounded-md cursor-default"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onClick={() => !isFocused && setIsFocused(true)}
            >
                <span>{filter}</span>
                <span><IoIosArrowDown /></span>

                <ul className={`w-full absolute top-[105%] left-0 bg-black border border-dark-5/50 ${isFocused ? "visible" : "invisible"}`}>
                    {["Block no.", "Address", "Tx Hash"].map(filter => (
                        <li 
                            key={filter}
                            className={`px-2.5 py-1 text-[15px] hover:bg-blue-500`}
                            onClick={() => {
                                setFilter(filter);
                                setIsFocused(false);
                            }}
                        >{filter}</li>
                    ))}
                </ul>
            </div>
            <input 
                type="text" 
                className="w-3/4 focus-visible:outline-none border-2 border-transparent focus:border-dark-2 caret-dark-5 text-white py-1 px-2.5 rounded-md bg-dark-4"
                placeholder="Search by Address / Txn Hash / Block no."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button className="w-[5%] py-2 px-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md"><BsSearch /></button>
        </div>
    );
}

export default SearchBar;
