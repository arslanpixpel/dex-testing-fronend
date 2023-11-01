import React, { useState } from "react";
import Notification from "./Notification";
// import Market from "./Market";
// import Trade from "./Trade";
//import cart from "../../asssets/images/shopping-cart.svg";
// import inventoryBlue from "../../asssets/images/inventory-blue.svg";
// import cartBlue from "../../asssets/images/cart.svg";
//import inventory from "../../asssets/images/inventory.svg";
import wallet from "../../asssets/images/wallet-header.svg";
import walletBlue from "../../asssets/images/wallet-blue.svg";
import profile from "../../asssets/images/profile.svg";
import profileBlue from "../../asssets/images/profile-blue.svg";
import logo from "../../asssets/images/logo.svg";
//import notification from "../../asssets/images/notification.svg";
import { useNavigate } from "react-router-dom";
import Iconmenu from "../../asssets/images/menu.svg";
import { useAppContext } from "../../contexts/AppContext";
import launchpad from "../../asssets/images/launchpad.svg";
import launchpadBlue from "../../asssets/images/launchpad-blue.svg";
import marketplace from "../../asssets/images/marketplace.svg";
import marketplaceblue from "../../asssets/images/marketplace-blue.svg";
import gamedashboard from "../../asssets/images/gamedashboard.svg";
import gamedashboardblue from "../../asssets/images/gamedashboard-blue.svg";
import nftfactory from "../../asssets/images/nftfactory.svg";
import nftfactoryblue from "../../asssets/images/nftfactory-blue.svg";

// /import ConnectWalletButton from "./ConnectWalletButton/ConnectWalletButton";

const DeveloperHeaderPixpel = () => {
  const context = useAppContext();
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-app-black flex justify-between px-8 py-5 items-center mb-11">
      <div className="flex flex-row justify-center gap-7 items-center">
        <img src={logo} alt="logo" onClick={() => navigate("/")} className="cursor-pointer" />
        <div className="hidden xl:flex gap-4 ">
          {/* <Market />
          <div
            className="relative flex justify-start px-5 border-b-2 border-app-black py-1 hover:text-app-blue"
            onClick={async () => {
              navigate("/nft-market");
              context.setDeveloperHeader(0);
            }}
          >
            NFT
          </div> */}
          <div
            className={
              (context.developerHeader === 0 ? "text-app-blue px-5 py-1" : "") +
              "hover:text-app-blue cursor-pointer px-5 py-1"
            }
            onClick={async () => {
              navigate("/game-market");
              await context.setDeveloperHeader(0);
            }}
          >
            Game
          </div>
          <div
            className={
              (context.developerHeader === 1 ? "text-app-blue px-5 py-1" : "") +
              "hover:text-app-blue cursor-pointer px-5 py-1"
            }
            onClick={async () => {
              navigate("/staking");
              context.setDeveloperHeader(1);
            }}
          >
            Launchpad
          </div>
          {/* <Trade /> */}
          <div
            className={
              (context.developerHeader === 2 ? "text-app-blue px-5 py-1" : "") +
              "hover:text-app-blue cursor-pointer px-5 py-1"
            }
            onClick={() => {
              navigate("/swap-master/swap");
              context.setDeveloperHeader(2);
            }}
          >
            DEX
          </div>
          <div
            className={
              (context.developerHeader === 3 ? "text-app-blue  px-5 py-1" : "") +
              "hover:text-app-blue cursor-pointer w-max  px-5 py-1"
            }
            onClick={() => {
              navigate("/developerwallet");
              context.setDeveloperHeader(3);
            }}
          >
            Wallet
          </div>
        </div>
      </div>
      {/* <ConnectWalletButton /> */}
      <div
        className="hidden lg:flex bg-app-black-button px-10 py-3 rounded-md text-app-blue w-max hover:cursor-pointer items-center"
        onClick={() => {
          context.setPlayer(true);
        }}
      >
        Developer
      </div>
      <div className="hidden xl:flex gap-5 items-center">
        <div className="relative inline-flex flex-col items-start ">
          {context.developerHeader === 1 && (
            <div
              className="w-2 h-2 bg-green-500 rounded-full -mt-[10px] mb-1"
              style={{ zIndex: 1 }}
            />
          )}
          <div
            className=" cursor-pointer"
            onClick={() => {
              navigate("/nft-market");
              context.setDeveloperHeader(1);
            }}
          >
            <img
              src={context.developerHeader === 1 ? launchpadBlue : launchpad}
              alt="cart"
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="relative inline-flex flex-col items-start ">
          {context.developerHeader === 2 && (
            <div
              className="w-2 h-2 bg-green-500 rounded-full -mt-[10px] mb-1"
              style={{ zIndex: 1 }}
            />
          )}
          <div
            className=" cursor-pointer"
            onClick={() => {
              navigate("/nft-market");
              context.setDeveloperHeader(2);
            }}
          >
            <img
              src={context.developerHeader === 2 ? nftfactoryblue : nftfactory}
              alt="cart"
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="relative inline-flex flex-col items-start ">
          {context.developerHeader === 3 && (
            <div
              className="w-2 h-2 bg-green-500 rounded-full -mt-[10px] mb-1"
              style={{ zIndex: 1 }}
            />
          )}
          <div
            className=" cursor-pointer"
            onClick={() => {
              navigate("/nft-market");
              context.setDeveloperHeader(3);
            }}
          >
            <img
              src={context.developerHeader === 3 ? marketplaceblue : marketplace}
              alt="cart"
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="relative inline-flex flex-col items-start ">
          {context.developerHeader === 4 && (
            <div
              className="w-2 h-2 bg-green-500 rounded-full -mt-[10px] mb-1"
              style={{ zIndex: 1 }}
            />
          )}
          <div
            className=" cursor-pointer"
            onClick={() => {
              navigate("/nft-market");
              context.setDeveloperHeader(4);
            }}
          >
            <img
              src={context.developerHeader === 4 ? gamedashboardblue : gamedashboard}
              alt="cart"
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="relative inline-flex flex-col items-start ">
          {context.developerHeader === 5 && (
            <div
              className="w-2 h-2 bg-green-500 rounded-full -mt-[10px] mb-1"
              style={{ zIndex: 1 }}
            />
          )}
          <div
            className=" cursor-pointer"
            onClick={() => {
              navigate("/wallet");
              context.setDeveloperHeader(5);
            }}
          >
            <img
              src={context.developerHeader === 5 ? walletBlue : wallet}
              alt="wallet"
              className="cursor-pointer"
            />
          </div>
        </div>
        <Notification />
        {/* <img
          src={context.developerHeader === 6 ? profileBlue : profile}
          alt="profile"
          className="cursor-pointer"
          onClick={() => {
            navigate("/profile");
            context.setDeveloperHeader(6);
          }}
        /> */}

        <div className="relative inline-flex flex-col items-start ">
          {context.developerHeader === 6 && (
            <div
              className="w-2 h-2 bg-green-500 rounded-full -mt-[10px] mb-1"
              style={{ zIndex: 1 }}
            />
          )}
          <div
            className=" cursor-pointer"
            onClick={() => {
              navigate("/profile");
              context.setDeveloperHeader(6);
            }}
          >
            <img
              src={context.developerHeader === 6 ? profileBlue : profile}
              alt="profile"
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
      <div className="xl:hidden flex" onClick={() => setOpenMenu(!openMenu)}>
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
              navigate("/game-market");
            }}
            className="hover:text-app-blue cursor-pointer"
          >
            Game
          </div>
          <div
            onClick={() => {
              setOpenMenu(false);
              navigate("/staking");
            }}
            className="hover:text-app-blue cursor-pointer"
          >
            Launchpad
          </div>
          <div
            onClick={() => {
              setOpenMenu(false);
              navigate("/swap-master/swap");
            }}
            className="hover:text-app-blue cursor-pointer"
          >
            DEX
          </div>
          <div
            onClick={() => {
              setOpenMenu(false);
              navigate("/exchange");
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
                navigate("/nft-market");
              }}
            />
            <img
              src={nftfactory}
              alt="cart"
              onClick={() => {
                setOpenMenu(false);
                navigate("/nft-market");
              }}
            />
            <img
              src={marketplace}
              alt="notification"
              onClick={() => {
                setOpenMenu(false);
                navigate("/notification");
              }}
            />
            <img
              src={gamedashboard}
              alt="inventory"
              onClick={() => {
                setOpenMenu(false);
                navigate("/inventory");
              }}
            />
            <img
              src={wallet}
              alt="wallet"
              onClick={() => {
                setOpenMenu(false);
                navigate("/developerwallet");
              }}
            />
            <img
              src={profile}
              alt="profile"
              onClick={() => {
                setOpenMenu(false);
                navigate("/profile");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperHeaderPixpel;
