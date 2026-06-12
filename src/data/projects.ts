import type { Project } from "@/types";

export const projects: Project[] = [
  {
    title: "BYU-Hawaii New Style Design",
    description:
      "This project is a project that modified style of BYU Hawaii, it has different colors, icons and logos. But i can't post it because I do not want to get any violating copyright, but my purpose of making it is just for practice. I made this modification purely for practice especially layouting Web Design.",
    image: "/images/byuhdesign.png",
    tags: ["HTML", "CSS"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Superstition",
    description:
      "Superstitions, this project is an Indonesian version of a website dedicated to sharing global superstitions and cultural beliefs. It features a user-submission form that uses AJAX and JSON to collect and store data dynamically and a message pop-up after submitting the form.",
    image: "/images/superstition.png",
    tags: ["HTML", "CSS", "Javascript"],
    liveUrl: "https://ramaputra1.github.io/Superstition/",
    githubUrl: "https://github.com/ramaputra1/Superstition",
  },
  {
    title: "Air Quality Index Check",
    description:
      "This project helps users check the air quality of any city by typing the city's name. It uses the OpenWeatherApp APIs to fetch real-time AQI data and displays it. The website is useful for quickly checking air quality conditions in specific cities, promoting awareness of environmental health factors.",
    image: "/images/air-quality.png",
    tags: ["HTML", "Tailwind CSS", "Javascript"],
    liveUrl: "https://ramaputra1.github.io/Air-Quality-App/public/index.html",
    githubUrl: "https://github.com/ramaputra1/Air-Quality-App",
  },
  {
    title: "Coming Soon",
    description:
      "A new project is in progress and will be added to the portfolio soon.",
    image: "/images/project-soon.png",
    tags: ["Coming Soon"],
    liveUrl: "#",
    githubUrl: "#",
  },
];
