import { useState } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  // console.log("------Header.jsx-----");
  const page = window.location.pathname.split("/")[1];

  function headerLeftIcon() {
    switch (page) {
      case "":
      case "play":
        return (
          <NavLink to="./menu">
            {({ isActive }) => {
              return (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="icon-share cursor-pointer"
                  fill={isActive ? "fill-current" : "none"}
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 2.75H5C3.75736 2.75 2.75 3.75736 2.75 5V8C2.75 9.24264 3.75736 10.25 5 10.25H8C9.24264 10.25 10.25 9.24264 10.25 8V5C10.25 3.75736 9.24264 2.75 8 2.75Z"
                    stroke="#1B1B1B"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M19 2.75H16C14.7574 2.75 13.75 3.75736 13.75 5V8C13.75 9.24264 14.7574 10.25 16 10.25H19C20.2426 10.25 21.25 9.24264 21.25 8V5C21.25 3.75736 20.2426 2.75 19 2.75Z"
                    stroke="#1B1B1B"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M19 13.75H16C14.7574 13.75 13.75 14.7574 13.75 16V19C13.75 20.2426 14.7574 21.25 16 21.25H19C20.2426 21.25 21.25 20.2426 21.25 19V16C21.25 14.7574 20.2426 13.75 19 13.75Z"
                    stroke="#1B1B1B"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 13.75H5C3.75736 13.75 2.75 14.7574 2.75 16V19C2.75 20.2426 3.75736 21.25 5 21.25H8C9.24264 21.25 10.25 20.2426 10.25 19V16C10.25 14.7574 9.24264 13.75 8 13.75Z"
                    stroke="#1B1B1B"
                    strokeWidth="1.5"
                  />
                </svg>
              );
            }}
          </NavLink>
        );
        break;

      case "setting":
        return <div></div>;

      default:
        break;
    }
  }

  function headerRightIcon() {
    switch (page) {
      case "":
      case "play":
        return (
          <NavLink to="./share" className="icon-share cursor-pointer">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 3.5L15 6.5M12 14.5V3.5V14.5ZM12 3.5L9 6.5L12 3.5Z"
                stroke="#1B1B1B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 19H8C7.01367 19 6.69515 18.9953 6.45248 18.9569C4.95485 18.7197 3.78029 17.5451 3.54309 16.0475C3.50466 15.8048 3.5 15.4863 3.5 14.5C3.5 13.5137 3.50466 13.1952 3.54309 12.9525C3.78029 11.4549 4.95485 10.2803 6.45248 10.0431C6.69515 10.0047 7.01367 10 8 10H8.25C8.66421 10 9 9.66421 9 9.25C9 8.83579 8.66421 8.5 8.25 8.5H8C7.07099 8.5 6.60649 8.5 6.21783 8.56156C4.07837 8.90042 2.40042 10.5784 2.06156 12.7178C2 13.1065 2 13.571 2 14.5C2 15.429 2 15.8935 2.06156 16.2822C2.40042 18.4216 4.07836 20.0996 6.21783 20.4384C6.60649 20.5 7.07099 20.5 8 20.5H16C16.929 20.5 17.3935 20.5 17.7822 20.4384C19.9216 20.0996 21.5996 18.4216 21.9384 16.2822C22 15.8935 22 15.429 22 14.5C22 13.571 22 13.1065 21.9384 12.7178C21.5996 10.5784 19.9216 8.90042 17.7822 8.56156C17.3935 8.5 16.929 8.5 16 8.5H15.75C15.3358 8.5 15 8.83579 15 9.25C15 9.66421 15.3358 10 15.75 10H16C16.9863 10 17.3048 10.0047 17.5475 10.0431C19.0451 10.2803 20.2197 11.4549 20.4569 12.9525C20.4953 13.1952 20.5 13.5137 20.5 14.5C20.5 15.4863 20.4953 15.8048 20.4569 16.0475C20.2197 17.5451 19.0451 18.7197 17.5475 18.9569C17.3048 18.9953 16.9863 19 16 19Z"
                fill="#1B1B1B"
              />
            </svg>
          </NavLink>
        );
        break;

      case "setting":
        return <div></div>;

      default:
        break;
    }
  }

  function headerTitle() {
    switch (page) {
      case "":
      case "play":
        return (
          <NavLink to="/">
            <h1 className="text-black text-[20px] cursor-pointer">
              Mindful Dev
            </h1>
          </NavLink>
        );
        break;

      case "setting":
        return (
          <h1 className="text-black text-[20px]">Setting</h1>
        );

      default:
        break;
    }
  }

  return (
    <div className="flex  justify-between">
      {headerLeftIcon()}
      {headerTitle()}
      {headerRightIcon()}
    </div>
  );
};

export default Header;
