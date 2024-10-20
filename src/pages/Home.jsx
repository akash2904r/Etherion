import { FaEthereum } from "react-icons/fa";

import { SearchBar, Details } from "../components";

function Home() {
    return (
        <main className="bg-dark-3 py-14 px-5">
            <h3 className="flex items-center gap-1 text-xl font-semibold text-white pb-3">
                <span>The Ethereum</span>
                <FaEthereum />
                <span>Blockchain Explorer</span>
            </h3>
            <SearchBar />

            <section className="flex items-center gap-5">
                <Details latest="Blocks" />
                <Details latest="Transactions" />
            </section>
        </main>
    );
}

export default Home;
