import { Routes, Route, Link, Navigate, useLocation, useParams } from "react-router-dom";
import "./scss/index.scss";
import { SwapMaster } from "./pages/index";
import { Header, Footer } from "./components";
import { useWalletConnect } from "./hooks/useWalletConnect";

import Layout from "../src/ccd-bridge/components/organisms/layout/Layout";
import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";
import network from "../src/ccd-bridge/config/network";
import useCCDWallet from "../src/ccd-bridge/hooks/use-ccd-wallet";
import useMediaQuery from "../src/ccd-bridge/hooks/use-media-query";
import moment from "moment";
import { useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { routes } from "./ccd-bridge/constants/routes";
import { appContext } from "./ccd-bridge/root/app-context";
import WatchWithdrawals from "./ccd-bridge/root/WatchWithdrawals";
import useCCDWalletStore from "./ccd-bridge/store/ccd-wallet/ccdWalletStore";
import GlobalStyles from "./ccd-bridge/theme/global";
import "./scss/globals.css";
import { configureChains, mainnet, createClient, WagmiConfig, goerli } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

moment.updateLocale("en", {
  relativeTime: {
    future: "in ~%s",
    past: "%s ago",
    s: "1s",
    ss: "%ss",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1Y",
    yy: "%dY",
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

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

const kava = {
  /** ID in number form */
  id: 2221,
  /** Human-readable name */
  name: "KAVA EVM TESTNET",
  /** Internal network name */
  network: "kava",
  /** Currency used by chain */
  nativeCurrency: {
    name: "KAVA",
    /** 2-6 characters long */
    symbol: "KAVA",
    decimals: 18,
  },
  /** Collection of RPC endpoints */
  rpcUrls: {
    default: { http: ["https://evm.testnet.kava.io"] },
  },
  // /** Collection of block explorers */
  // blockExplorers?: {
  //     [key: string]: BlockExplorer;
  //     default: BlockExplorer;
  // };
  // /** Collection of contracts */
  // contracts?: {
  //     ensRegistry?: Contract;
  //     multicall3?: Contract;
  // };
  /** Flag for test networks */
  testnet: true,
};
const { provider } = configureChains([kava, mainnet, goerli], [publicProvider()]);
const client = createClient({
  autoConnect: true,
  provider,
});

function App() {
  function UseConcordiumEvents() {
    const { refreshMostRecentlySelectedAccount } = useCCDWallet();
    const { setWallet, deleteWallet } = useCCDWalletStore();

    // Sets up event handlers once, globally.
    useEffect(() => {
      detectConcordiumProvider().then(p => {
        p.on("accountChanged", setWallet);
        p.on("accountDisconnected", () => {
          deleteWallet();
        });
        p.on("chainChanged", c => {
          // There is a bug in the browser wallet not properly triggering this
          // if no account in the wallet is connected to the dapp for the network selected.
          // As such, this is unreliable for now.
          if (c === network.ccd.genesisHash) {
            refreshMostRecentlySelectedAccount();
          } else {
            deleteWallet();
          }
        });
      });
    }, []);
  }

  const isTablet = useMediaQuery("(max-width: 1050px)"); // res at which cornucopia logo might touch the modal
  const isMobile = useMediaQuery("(max-width: 540px)"); // res at which the design looks a little weird
  const { tx } = useParams();
  const { pathname } = useLocation();
  UseConcordiumEvents();

  /**
   * Shows whether user is on withdraw progress page, in which case we should NOT watch for pending withdrawals
   */
  const isWithdrawProgressRoute = useMemo(
    () => tx !== undefined && pathname === routes.withdraw.tx(tx),
    [pathname, tx],
  );
  const appContextValue = useMemo(() => ({ isTablet, isMobile }), [isTablet, isMobile]);
  useWalletConnect();

  return (
    <div className="App">
      <WagmiConfig client={client}>
        <appContext.Provider value={appContextValue}>
          <GlobalStyles />
          <QueryClientProvider client={queryClient}>
            <Layout>
              {isWithdrawProgressRoute || <WatchWithdrawals />}
              <Header />
              <Routes>
                <Route path="/" element={<Navigate to="/swap-master/swap" replace />} />

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
            </Layout>
          </QueryClientProvider>
        </appContext.Provider>
      </WagmiConfig>
    </div>
  );
}

export default App;
