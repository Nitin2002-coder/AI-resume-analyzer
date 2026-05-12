import {Link} from "react-router";
import ThemeToggle from "~/components/layout/ThemeToggle";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <p className="brand-mark">CareerLens</p>
            </Link>
            <div className="flex items-center gap-3">
                <ThemeToggle />
                <Link to="/upload" className="primary-button w-fit">
                    Upload
                </Link>
            </div>
        </nav>
    )
}
export default Navbar
