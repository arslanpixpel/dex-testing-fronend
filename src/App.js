/* eslint-disable no-unused-vars */
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "./scss/index.scss";

import {
  AddressManagement,
  Home,
  NFTMarket,
  Stacking,
  Exchange,
  HelpCenter,
  Inventory,
  Notification,
  Profile,
  SwapMaster,
  UserHome,
  Wallet,
  Withdraw,
  GameMarket,
  Collection,
  CreateNFT,
  MyCollection,
  MysteryBox,
  MintFinish,
  Developer,
  BuyCrypto,
  GameLanding,
  StakingPortfolio,
  TokenRoom,
  Mint,
  Burn,
  DeveloperWallet,
  NotVerified,
  DeveloperProfile,
} from "./pages/index";
import { Header, Footer } from "./components";
import { useWalletConnect } from "./hooks/useWalletConnect";
import PlayerHeader from "./components/Header/PlayerHeader";
import PlayerHeaderPixpel from "./components/Header/PlayerHeaderPixpel";
import DeveloperHeaderPixpel from "./components/Header/DeveloperHeaderPixpel";
import PixpelHeader from "./components/Header/PixpelHeader";
import Sockets from "./pages/SwapMaster/sockets";
import { useEffect, useState } from "react";

function Test() {
  return (
    <>
      <main>
        <h2>404</h2>
        <p>That feels like an existential question, don&apos;t you think?</p>
      </main>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </>
  );
}

function App() {
  const [user, setUser] = useState();
  const storedUsername = localStorage.getItem("username");

  useEffect(() => {
    setUser(storedUsername);

    if (!user || user === undefined || user === "" || user === null) {
      window.location.href = "https://www.pixpel.io";
    }
  }, [storedUsername]);

  useWalletConnect();

  return (
    <div className="App">
      {/* <Header /> */}
      <PixpelHeader />
      {/* <DeveloperHeaderPixpel /> */}

      <Routes>
        <Route path="/" element={<Navigate to="/swap-master/swap" replace />} />
        <Route path="/sockets" element={<Sockets />} />
        {/*<Route path="/nft-market" element={<NFTMarket />} />*/}
        {/*<Route path="/game-market" element={<GameMarket />} />*/}
        {/*<Route path="/staking" element={<Stacking />} />*/}
        {/*<Route path="/exchange" element={<Exchange />} />*/}
        {/*<Route path="/help-center" element={<HelpCenter />} />*/}
        {/*<Route path="/inventory" element={<Inventory />} />*/}
        {/*<Route path="/notification" element={<Notification />} />*/}
        {/*<Route path="/profile" element={<Profile />} />*/}
        <Route path="/swap-master/*" element={<SwapMaster />} />
        {/*<Route path="/wallet" element={<Wallet />} />*/}
        {/*<Route path="/withdraw" element={<Withdraw />} />*/}
        {/*<Route path="/address-management" element={<AddressManagement />} />*/}
        {/*<Route path="/account" element={<UserHome />} />*/}
        {/*<Route path="/collection" element={<Collection />} />*/}
        {/*<Route path="/mycollection" element={<MyCollection />} />*/}
        {/*<Route path="/create-nft" element={<CreateNFT />} />*/}
        {/*<Route path="/finishmint" element={<MintFinish />} />*/}
        {/*<Route path="/developer" element={<Developer />} />*/}
        {/*<Route path="/mysterybox" element={<MysteryBox />} />*/}
        {/*<Route path="/buycrypto" element={<BuyCrypto />} />*/}
        {/*<Route path="/gamelanding" element={<GameLanding />} />*/}
        {/*<Route path="/stakingportfolio" element={<StakingPortfolio />} />*/}
        {/*<Route path="/tokenroom" element={<TokenRoom />} />*/}
        {/*<Route path="/developerwallet" element={<DeveloperWallet />} />*/}
        {/*<Route path="/notverified" element={<NotVerified />} />*/}
        {/*<Route path="/developerprofile" element={<DeveloperProfile />} />*/}
        {/*<Route path="/tokenroom/mint" element={<Mint />} />*/}
        {/*<Route path="/tokenroom/burn" element={<Burn />} />*/}
        <Route path="*" element={<Test />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
