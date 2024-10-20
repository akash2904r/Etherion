import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="flex items-center bg-dark-1 text-white px-5 py-1.5 border-b-[1px] border-dark-2">
            <Link to="/">
                <div className="flex items-center gap-2">
                    <span className="h-10 w-10 rounded-full">
                        <img 
                            src="/logo.png" 
                            alt="Logo" 
                            className="rounded-full"
                        />
                    </span>
                    <span className="text-[22px] font-poppins tracking-wide font-medium">Etherion</span>
                </div>
            </Link>
            <ul></ul>
        </nav>
    );
}

export default Navbar;
