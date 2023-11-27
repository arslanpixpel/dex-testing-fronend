import React, { useState, useEffect } from "react";
import { tableList, tablefiatList } from "../dataList";
import SwapButton from "./SwapButton";
import TradeButton from "./TradeButton";
import BuyButton from "./BuyButton";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

 
const CoinTable = (props) => {
    const navigate = useNavigate();
    const [tempTable, setTempTable] = useState(tableList);

  useEffect(() => {
    async function fetchDataDex() {
      const response = await axios.post('https://api.pixpel.io/api/v1/tokens/getlimitordersbywallet', {
        walletAddress: "4dgSpWaZf4Z5yDFE5hb6XpaioDv6kao7UF3wvZiMbFkynSdh1A"
      })    
            console.log("MY RESPONE", response.data);
           const arr = response.data ? response.data : undefined;
           const mappedTable = arr.map((val) => ({
            id: val._id,
            Coin: val.tokenFromid,
            Total: val.tokenfromvalue,
            Available: val.tokenfromvalue,
            Orders: val.tokenfromvalue,
            PIXP: val.price
        }));
        setTempTable([...tableList , ...mappedTable ])
           
        }
        fetchDataDex();     
    } , [])
    
        console.log("THIS IS TABLE"  , tempTable);
    

 

    const handleSwapClick = () => {
        navigate("/swap-master");
    };

    const handleTradeClick = () => {
        navigate("/exchange");
    };

    return (
        <div className="overflow-x-auto relative mt-10 w-full">
            <table className="table-auto">
                <thead>
                    <tr>
                        <td className="text-gray-400 w-1/6 pr-6 text-[16px] font-normal ">Coin</td>
                        <td className="text-gray-400 w-1/6 pr-6 text-[16px] font-normal">Total</td>
                        <td className="text-gray-400 pr-6 text-[16px] font-normal">Available</td>
                        <td className="text-gray-400 pr-6">
                            <div className="text-gray-400 w-max text-[16px] font-normal">In Orders</div>
                        </td>
                        <td className="text-gray-400 pr-6">
                            <div className="text-gray-400 w-max text-[16px] font-normal">PIXP Value</div>
                        </td>
                        <td className="text-gray-400 w-1/6 pl-6 text-[16px] font-normal">Action</td>
                    </tr>
                </thead>
                <tbody className="px-4">
                    {tempTable.map((menu, idx) => {
                        return (
                            <tr key={idx} className={idx !== tempTable.length - 1 ? "border-b-2 border-app-black" : ""}>
                                <td className="py-5 pr-6">
                                    <div className="w-max text-[16px] font-medium leading-normal">{menu.Coin}</div>
                                </td>
                                <td className="pr-6">
                                    <div className="w-max  text-[16px] font-medium leading-normal">{menu.Total}</div>
                                </td>
                                <td className="pr-6">
                                    <div className="w-max  text-[16px] font-medium leading-normal">
                                        {menu.Available}
                                    </div>
                                </td>
                                <td className="pr-6">
                                    <div className="w-max  text-[16px] font-medium leading-normal">{menu.Orders}</div>
                                </td>
                                <td className="pr-6">
                                    <div className="w-max  text-[16px] font-medium leading-normal">{menu.PIXP}</div>
                                </td>
                                <td className="pl-6">
                                    <div className="flex gap-4">
                                        <SwapButton title="Swap" handleClick={handleSwapClick} />
                                        <TradeButton title="Trade" handleClick={handleTradeClick} />
                                        <BuyButton
                                            title="Buy"
                                            handleClick={function () {
                                                console.log("Function not implemented.");
                                            }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CoinTable;
