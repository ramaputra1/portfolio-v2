import { useState, useEffect } from "react";

const Navbar = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="navbar py-7 flex items-center justify-between">
      <div className="logo">
        <h1 className="text-3xl font-bold bg-white text-black p-1 md:bg-transparent md:text-white">
          React Training
        </h1>
      </div>
      <ul
        className={`menu flex items-center gap-4 fixed left-1/2 -translate-x-1/2 bg-white/30 backdrop-blur-md p-3 rounded-br-2xl rounded-bl-2xl transition-all sm:gap-10 md:static md:-translate-x-0 md:opacity-100 md:bg-transparent md:transition-none ${active ? "top-0 opacity-100" : "-top-10 opacity-0"}`}
      >
        <li>
          <a href="#" className="text-base font-medium">
            Home
          </a>
        </li>
        <li>
          <a href="#" className="text-base font-medium">
            About
          </a>
        </li>
        <li>
          <a href="#" className="text-base font-medium">
            Project
          </a>
        </li>
        <li>
          <a href="#" className="text-base font-medium">
            Contact
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
