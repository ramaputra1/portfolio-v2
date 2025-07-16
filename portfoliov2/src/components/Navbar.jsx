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
          Rama Portfolio
        </h1>
      </div>
      <ul
        className={`menu bg-[#000000]/90 p-3 rounded-br-2xl rounded-bl-2xl flex gap-10 items-center fixed left-1/2 -translate-x-1/2 md:-translate-0 -top-10 md:static ${
          active ? "top-0 opacity-100" : "-top-0 opacity-0"
        }`}
      >
        <li>
          <a href="#" className="text-lg font-medium">
            Home
          </a>
        </li>
        <li>
          <a href="#" className="text-lg font-medium">
            About
          </a>
        </li>
        <li>
          <a href="#" className="text-lg font-medium">
            Project
          </a>
        </li>
        <li>
          <a href="#" className="text-lg font-medium">
            Contact
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
