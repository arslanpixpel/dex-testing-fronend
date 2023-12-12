import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pixpelRequest } from "../../utils/axios";
import Button from "./Button";

function LimitOrders() {
  const limitsuccessmodal = useSelector(s => s.swap.limitsuccessmodal);
  const [tempTable, setTempTable] = useState([]);
  const account = useSelector(s => s.connect.account);
  const [openorder, setOpenOrders] = useState([]);
  const [filter, setFilter] = useState(false);
  const dispatch = useDispatch();

  async function fetchDataDex() {
    setFilter(false);
    const response = await pixpelRequest.post("/tokens/getlimitordersbywallet", {
      walletAddress: "341THe74fqpi9uohgGBbKpedqAjz2bNCgnbRWacrKVs9pPDq6U",
    });

    console.log(response.data, "getlimitordersbywallet Data");

    setTempTable(response.data);
  }

  console.log(limitsuccessmodal, "limitsuccessmodal");

  useEffect(() => {
    console.log("WALLET NUMBER : ", account);

    fetchDataDex();
  }, []);

  const openorders = () => {
    console.log(tempTable);
    const filteredOrder = tempTable.filter(
      order => order.paid === false && order.expiry > Date.now(),
    );

    console.log(filteredOrder);
    setTempTable(filteredOrder);
    setFilter(true);
  };

  const getallorders = () => {
    fetchDataDex();
  };

  return (
    <div className="overflow-x-auto relative mt-10 w-full">
      <div className="flex gap-4 py-4">
        <Button onClick={openorders} title={"OPEN ORDER"} selected={filter} />
        <Button onClick={getallorders} title={"ORDER HISTORY"} selected={!filter} />
      </div>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <td className="text-gray-400 pr-6 text-[16px] font-normal">OrderID</td>
            <td className="text-gray-400 pr-6 text-[16px] font-normal">Token From</td>
            <td className="text-gray-400 pr-6 text-[16px] font-normal">Token To</td>
            <td className="text-gray-400 pr-6 text-[16px] font-normal">Paid</td>
            <td className="pr-6">
              <div className="text-gray-400 w-max text-[16px] font-normal">Price</div>
            </td>
            {/* <td className="pr-6">
        <div className="text-gray-400 w-max text-[16px] font-normal">PIXP Value</div>
      </td>
      <td className="pl-6 text-gray-400 pr-6 text-[16px] font-normal">Action</td> */}
          </tr>
        </thead>
        <tbody className="px-4">
          {tempTable
            ? tempTable?.map((menu, idx) => (
                <tr
                  key={idx}
                  className={idx !== tempTable.length - 1 ? "border-b-2 border-app-black" : ""}
                >
                  <td className="pr-6">
                    <div className="w-max text-[16px] font-medium leading-normal">{menu._id}</div>
                  </td>
                  <td className="py-5 pr-6">
                    <div className="w-max text-[16px] font-medium leading-normal">
                      {menu.tokenfromName}
                    </div>
                  </td>
                  <td className="pr-6">
                    <div className="w-max text-[16px] font-medium leading-normal">
                      {menu.tokentoName}
                    </div>
                  </td>
                  <td className="pr-6">
                    <div className="w-max text-[16px] font-medium leading-normal">
                      {menu.paid.toString()}
                    </div>
                  </td>
                  <td className="pr-6">
                    <div className="w-max text-[16px] font-medium leading-norma ">{menu.price}</div>
                  </td>
                  {/* <td className="pr-6">
                    <div className="w-max text-[16px] font-medium leading-normal">{menu.PIXP}</div>
                  </td>
                  <td className="pl-6">
                    <div className="flex gap-4"></div>
                  </td> */}
                </tr>
              ))
            : "No data available"}
        </tbody>
      </table>
    </div>
  );
}

export default LimitOrders;
