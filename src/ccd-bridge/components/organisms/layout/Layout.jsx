import React from "react";
import { Wrapper } from "./Layout.style.js";

const Layout = ({ children }) => {
  return <Wrapper style={{ opacity: 0 }}>{children}</Wrapper>;
};

export default Layout;
