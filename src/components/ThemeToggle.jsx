import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
const getCookie = name => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};
const setCookie = (name, value, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict`;
};
const ThemeToggle = ({
  className = "",
  size = 20
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  useEffect(() => {
    const savedTheme = getCookie("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setIsDarkMode(initialTheme === "light");
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);
  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute("data-theme", newTheme);
    setCookie("theme", newTheme, 365);
  };
  return <button onClick={toggleTheme} className={`${className}`} title={`Switch to ${isDarkMode ? "light" : "dark"} mode`} aria-label={`Toggle ${isDarkMode ? "light" : "dark"} mode`}>
      {isDarkMode ? <Sun size={size} /> : <Moon size={size} />}
    </button>;
};
export default ThemeToggle;