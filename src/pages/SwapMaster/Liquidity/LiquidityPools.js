import BigNumber from "bignumber.js";
import { useDispatch, useSelector } from "react-redux";

// Components
import { MainButton } from "../../../components/Button/MainButton";

// Utils
import { getShortTokenName, getTokenUiAmount, parseTokenAddress } from "../../../utils/format";
import { isSameToken } from "../utils";
// Actions
import { setLiquidityTokenTo } from "../../../store/reducers/SwapMaster/liquiditySlice";

// Constants
import { CCD_DECIMALS } from "../../../config";

const LiquidityPools = ({ openLiquidityForm }) => {
  const tokenList = useSelector(s => s.swapMaster.tokenList);
  const exchanges = useSelector(s => s.swapMaster.exchanges);
  const dispatch = useDispatch();

  const isTokenListLoaded = useSelector(s => s.swapMaster.isTokenListLoaded);

  if (!isTokenListLoaded) return null;

  const handleOpenForm =
    (tokenToData, isUnstakeMode = false, isCreateMode = false) =>
    () => {
      if (tokenToData) dispatch(setLiquidityTokenTo(tokenToData));

      openLiquidityForm({ isUnstakeMode, isCreateMode });
    };

  const handleCreateLiquidity = () => {
    const newExchangeTokenToData = tokenList.find(
      ({ address, tokenId }) =>
        address &&
        exchanges.length &&
        exchanges.every(exchange => {
          const { index, subindex } = parseTokenAddress(exchange.token.address);

          return !isSameToken(
            { index: address.index, subindex: address.subindex, tokenId },
            { index, subindex, tokenId: exchange.token.id },
          );
        }),
    );

    handleOpenForm(newExchangeTokenToData, false, true)();
  };

  const exchangesTable = (
    <div className="flex flex-col mb-5">
      <div className="hidden md1:flex">
        <div className="w-1/3 text-gray-500 text-sm md:text-base">Pair</div>
        <div className="w-1/3 text-gray-500 text-sm md:text-base text-center">LP</div>
      </div>
      {exchanges.reduce((acc, { token, lpTokensHolderBalance }, i) => {
        const tokenFrom = tokenList[0];
        const tokenTo = tokenList.find(({ address, tokenId }) => {
          const { index, subindex } = parseTokenAddress(token.address);

          return (
            address &&
            isSameToken(
              { index: address.index, subindex: address.subindex, tokenId },
              { index, subindex, tokenId: token.id },
            )
          );
        });

        if (!tokenTo) return acc;

        acc.push(
          <div
            key={i}
            className="flex text-lg border-b-2 border-gray-500 py-4 items-center flex-col md1:flex-row"
          >
            <div className="flex md1:w-1/3 gap-2">
              <img className="h-6" src={tokenFrom.images?.thumbnail.url} alt={tokenFrom.symbol} />
              <p title={tokenFrom.symbol}>{getShortTokenName(tokenFrom.symbol)}</p>
              <span>/</span>
              <img
                className="h-6"
                src={tokenTo.images?.thumbnail.url}
                alt={tokenTo.symbol}
                style={tokenTo.style}
              />
              <p title={tokenTo.symbol}>{getShortTokenName(tokenTo.symbol)}</p>
            </div>
            <div className="md1:w-1/3 text-center">
              {getTokenUiAmount(BigNumber(lpTokensHolderBalance), CCD_DECIMALS)}
            </div>
            <div className="flex md1:w-1/3 justify-end">
              <MainButton className="w-28 h-14 bg-app-green mr-8" onClick={handleOpenForm(tokenTo)}>
                Stake
              </MainButton>
              <MainButton className="w-28 h-14 bg-app-red" onClick={handleOpenForm(tokenTo, true)}>
                Unstake
              </MainButton>
            </div>
          </div>,
        );

        return acc;
      }, [])}
    </div>
  );

  return (
    <div className="flex flex-col mx-auto my-0 w-184">
      <div className="flex justify-center md1:justify-end">
        <MainButton className="w-28 h-14 bg-app-green" onClick={handleCreateLiquidity}>
          Create
        </MainButton>
      </div>
      {exchanges.length ? exchangesTable : <div className="text-center">No exchanges found</div>}
    </div>
  );
};

export default LiquidityPools;
