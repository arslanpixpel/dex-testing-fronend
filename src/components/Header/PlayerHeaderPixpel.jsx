import React, { useEffect, useState } from "react";
import Notification from "./Notification";
// import Market from "./Market";
// import Trade from "./Trade";
import cart from "../../asssets/images/shopping-cart.svg";
import inventoryBlue from "../../asssets/images/inventory-blue.svg";
import cartBlue from "../../asssets/images/cart.svg";
import inventory from "../../asssets/images/inventory.svg";
import wallet from "../../asssets/images/wallet-header.svg";
import walletBlue from "../../asssets/images/wallet-blue.svg";
import profile from "../../asssets/images/profile.svg";
import profileBlue from "../../asssets/images/profile-blue.svg";
import logo from "../../asssets/images/logo.svg";
import notification from "../../asssets/images/notification.svg";
import { useNavigate } from "react-router-dom";
import Iconmenu from "../../asssets/images/menu.svg";
import { useAppContext } from "../../contexts/AppContext";
import launchpad from "../../asssets/images/launchpad.svg";
import launchpadBlue from "../../asssets/images/launchpad-blue.svg";
import marketplace from "../../asssets/images/marketplace.svg";
import marketplaceblue from "../../asssets/images/marketplace-blue.svg";
//import greendot from "../../asssets/images/greendot.svg";
//import greendot from "../../asssets/images/greendot";
// /import ConnectWalletButton from "./ConnectWalletButton/ConnectWalletButton";

const PlayerHeaderPixpel = () => {
  const context = useAppContext();
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const queryString = window.location.search.substring(1);

    const queryParamsArray = queryString.split("&");

    const queryParams = {};

    queryParamsArray.forEach(param => {
      const pair = param.split("=");
      const key = decodeURIComponent(pair[0]);
      const value = decodeURIComponent(pair[1] || "");
      queryParams[key] = value;
    });

    if (!localStorage.getItem("username")) {
      localStorage.setItem("username", JSON.stringify(queryParamsArray?.[0]));
    }

    setUsername(localStorage.getItem("username"));

    // setUsername(queryParams);
  }, []);

  // useEffect(() => {
  //   if (!username) {
  //     console.log("Redirecting to pixpel.io");

  //     window.location.href = "https://www.pixpel.io";
  //   }
  // }, [username]);

  const handlelogout = () => {
    localStorage.clear();
    // window.location.href = "https://home.pixpel.io";
    window.location.href = "http://localhost:3000/?logout=true";
  };

  return (
    <div className="bg-app-black flex justify-between px-8 py-5 items-center mb-11">
      <div className="flex flex-row justify-center gap-7 items-center">
        {/* <img src={logo} alt="logo" onClick={() => navigate("/")} className="cursor-pointer" /> */}
        <img
          src={logo}
          alt="logo"
          onClick={() => (window.location.href = "https://home.pixpel.io/player/account")}
          className="cursor-pointer"
          width={220}
          height={62}
        />

        <div className="hidden xl:flex gap-4 ">
          {/* <Market /> */}
          {/* <div
            className={
              (context.playerHeader === 0 ? "text-app-blue px-5 py-1" : "") +
              "hover:text-app-blue cursor-pointer px-5 py-1"
            }
            onClick={async () => {
              window.location.href = "https://nft.pixpel.io/player/game-market";
              context.setPlayerHeader(0);
            }}
            >
            Game
          </div> */}
          <div
            className={
              (context.playerHeader === 1 ? "text-app-blue px-5 py-1" : "") +
              "hover:text-app-blue cursor-pointer px-5 py-1"
            }
            onClick={async () => {
              window.location.href = "https://launchpad.pixpel.io";
              context.setPlayerHeader(1);
            }}
          >
            Launchpad
          </div>{" "}
          <div
            className={"text-app-blue cursor-pointer w-max  px-5 py-1"}
            onClick={() => {
              // navigate("/swap-master/swap");
              context.setPlayerHeader(2);
            }}
          >
            DEX
          </div>
          <div
            className="relative flex justify-start px-5  border-app-black py-1 hover:text-app-blue cursor-pointer"
            onClick={async () => {
              // navigate("/nft-market");
              window.location.href = "https://nft.pixpel.io";

              context.setDeveloperHeader(0);
            }}
          >
            NFT
          </div>
          {/* <Trade /> */}
          <div
            className={
              (context.playerHeader === 3 ? "text-app-blue  px-5 py-1" : "") +
              "hover:text-app-blue cursor-pointer w-max  px-5 py-1"
            }
            onClick={() => {
              window.location.href = "https://home.pixpel.io/player/wallet";
              context.setPlayerHeader(7);
            }}
          >
            Wallet
          </div>
        </div>
      </div>
      {/* <ConnectWalletButton /> */}
      <div
        className="hidden lg:flex bg-app-black-button px-14 py-3 rounded-md text-app-blue w-max  items-center"
        // onClick={() => {
        //   context.setPlayer(false);
        // }}
      >
        Player
      </div>
      <div className="hidden xl:flex gap-5 items-center">
        <div className="relative inline-flex flex-col items-start ">
          {context.playerHeader === 1 && (
            <div
              className="w-2 h-2 bg-green-500 rounded-full -mt-[10px] mb-1"
              style={{ zIndex: 1 }}
            />
          )}
          <div
            className=" cursor-pointer"
            onClick={() => {
              window.location.href = "https://launchpad.pixpel.io";
              context.setPlayerHeader(1);
            }}
          >
            <img
              src={context.playerHeader === 1 ? launchpadBlue : launchpad}
              alt="cart"
              className="cursor-pointer"
            />
            <div className="absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100">
              <img src={launchpadBlue} alt="hover-image" className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* <div className="relative inline-flex flex-col items-start ">
          {context.playerHeader === 2 && (
            <div
              className="w-2 h-2 bg-green-500 rounded-full -mt-[10px] mb-1"
              style={{ zIndex: 1 }}
            />
          )}
          <div
            className="w-8 h-8 cursor-pointer"
            onClick={() => {
              window.location.href = "https://nft.pixpel.io/player/store";
              context.setPlayerHeader(2);
            }}
          >
            <img
              src={context.playerHeader === 2 ? marketplaceblue : marketplace}
              alt="cart"
              className="w-full h-full"
            />
          </div>
        </div> */}

        <div className="relative inline-flex flex-col items-start ">
          {context.playerHeader === 2 && (
            <div
              className="w-2 h-2 bg-green-500 rounded-full -mt-[10px] mb-1"
              style={{ zIndex: 1 }}
            />
          )}
          <div
            className="w-8 h-8 cursor-pointer relative"
            onClick={() => {
              window.location.href = "https://nft.pixpel.io/player/store";
              context.setPlayerHeader(2);
            }}
          >
            <img
              src={context.playerHeader === 2 ? marketplaceblue : marketplace}
              alt="cart"
              className="w-full h-full"
            />
            <div className="absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100">
              <img src={marketplaceblue} alt="hover-image" className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* <div className="relative inline-flex flex-col items-start ">
          {context.playerHeader === 3 && (
            <div
              className="w-2 h-2 bg-green-500 rounded-full -mt-[10px] mb-1"
              style={{ zIndex: 1 }}
            />
          )}
          <div
            className=" cursor-pointer"
            onClick={() => {
              window.location.href = "https://nft.pixpel.io/player/shopping-cart?show=Cart";
              context.setPlayerHeader(3);
            }}
          >
            <img
              src={context.playerHeader === 3 ? cartBlue : cart}
              alt="cart"
              className="cursor-pointer"
              onClick={() => {
                window.location.href = "https://nft.pixpel.io/player/shopping-cart?show=Cart";
                context.setPlayerHeader(3);
              }}
            />
          </div>
        </div> */}
        {/* <div className="relative inline-flex flex-col items-start ">
          {context.playerHeader === 4 && (
            <div
              className="w-2 h-2 bg-green-500 rounded-full -mt-[10px] mb-1"
              style={{ zIndex: 1 }}
            />
          )}
          <div
            className=" cursor-pointer"
            onClick={() => {
              window.location.href = "https://nft.pixpel.io/player/inventory";
              context.setPlayerHeader(4);
            }}
          >
            <img
              src={context.playerHeader === 4 ? inventoryBlue : inventory}
              alt="inventory"
              className="cursor-pointer"
            />
          </div>
        </div> */}
        <div className="relative inline-flex flex-col items-start ">
          {context.playerHeader === 5 && (
            <div
              className="w-2 h-2 bg-green-500 rounded-full -mt-[10px] mb-1"
              style={{ zIndex: 1 }}
            />
          )}
          <div
            className=" cursor-pointer"
            onClick={() => {
              window.location.href = "https://home.pixpel.io/player/wallet";
              context.setPlayerHeader(5);
            }}
          >
            <img
              src={context.playerHeader === 5 ? walletBlue : wallet}
              alt="wallet"
              className="cursor-pointer"
            />
            <div className="absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100">
              <img src={walletBlue} alt="hover-image" className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* <Notification /> */}

        <div className="relative inline-flex flex-col items-start ">
          {context.playerHeader === 6 && (
            <div
              className="w-2 h-2 bg-green-500 rounded-full -mt-[10px] mb-1"
              style={{ zIndex: 1 }}
            />
          )}
          <div
            className=" cursor-pointer"
            onClick={() => {
              window.location.href = "https://home.pixpel.io/player/profile";
              context.setPlayerHeader(6);
            }}
          >
            <img
              src={context.playerHeader === 6 ? profileBlue : profile}
              alt="profile"
              className="cursor-pointer"
            />
            <div className="absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100">
              <img src={profileBlue} alt="hover-image" className="w-full h-full" />
            </div>
          </div>
        </div>
        <div
          className="flex items-center justify-center w-36 h-12 rounded-lg bg-app-black-button hover:bg-app-blue gap-2 cursor-pointer"
          onClick={handlelogout}
        >
          <svg
            className="h-6 w-6 text-white"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <line x1="5" y1="12" x2="19" y2="12" />
            <line x1="5" y1="12" x2="11" y2="18" />
            <line x1="5" y1="12" x2="11" y2="6" />
          </svg>
          <h1>LOGOUT</h1>
        </div>
      </div>
      <div className="xl:hidden flex cursor-pointer" onClick={() => setOpenMenu(!openMenu)}>
        <img src={Iconmenu} alt="menu" />
      </div>
      <div
        className={
          (openMenu ? "-translate-x-0" : "translate-x-full") +
          " fixed top-0 right-0 w-screen z-50 min-h-screen bg-black bg-opacity-90 transform shadow-lg shadow-white duration-200"
        }
      >
        <div
          className="h-36 flex bg-black items-center pr-10 justify-end"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <p className="text-5xl cursor-pointer text-white">×</p>
        </div>
        <div className="w-full flex justify-center flex-col items-center gap-8 pt-10">
          <div
            onClick={() => {
              setOpenMenu(false);
              window.location.href = "https://nft.pixpel.io";
            }}
            className="hover:text-app-blue cursor-pointer"
          >
            NFT
          </div>
          <div
            onClick={() => {
              setOpenMenu(false);
              window.location.href = "https://launchpad.pixpel.io";
            }}
            className="hover:text-app-blue cursor-pointer"
          >
            Launchpad
          </div>
          <div
            onClick={() => {
              setOpenMenu(false);
              window.location.href = "/swap-master";
            }}
            className="hover:text-app-blue cursor-pointer"
          >
            DEX
          </div>
          <div
            onClick={() => {
              setOpenMenu(false);
              window.location.href = "https://home.pixpel.io/player/wallet";
            }}
            className="hover:text-app-blue cursor-pointer"
          >
            Wallet
          </div>

          <div className="flex gap-5">
            <img
              src={launchpad}
              alt="cart"
              onClick={() => {
                setOpenMenu(false);
                window.location.href = "https://launchpad.pixpel.io";
              }}
            />
            {/* <img
              src={marketplace}
              alt="cart"
              onClick={() => {
                setOpenMenu(false);
                window.location.href = "https://nft.pixpel.io";
              }}
            /> */}
            {/* <img
              src={cart}
              alt="notification"
              onClick={() => {
                setOpenMenu(false);
                navigate("/notification");
              }}
            />
            <img
              src={inventory}
              alt="inventory"
              onClick={() => {
                setOpenMenu(false);
                window.location.href = "https://nft.pixpel.io/player/inventory";
              }}
            /> */}
            <img
              src={wallet}
              alt="wallet"
              onClick={() => {
                setOpenMenu(false);
                window.location.href = "https://home.pixpel.io/player/wallet";
              }}
            />
            {/* <img
              src={notification}
              alt="notification"
              onClick={() => {
                setOpenMenu(false);
                navigate("/notification");
              }}
            /> */}
            <img
              src={profile}
              alt="profile"
              onClick={() => {
                setOpenMenu(false);
                window.location.href = "https://home.pixpel.io/player/profile";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerHeaderPixpel;
