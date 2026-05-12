import {useEffect, useState} from "react";

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = window.localStorage.getItem("career-lens-theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

        setIsDark(shouldUseDark);
        document.documentElement.classList.toggle("dark", shouldUseDark);
    }, []);

    const toggleTheme = () => {
        const nextTheme = !isDark;
        setIsDark(nextTheme);
        document.documentElement.classList.toggle("dark", nextTheme);
        window.localStorage.setItem("career-lens-theme", nextTheme ? "dark" : "light");
    };

    return (
        <button className="icon-button" type="button" onClick={toggleTheme} aria-label="Toggle dark mode" title="Toggle dark mode">
            <span>{isDark ? "L" : "D"}</span>
        </button>
    );
};

export default ThemeToggle;
