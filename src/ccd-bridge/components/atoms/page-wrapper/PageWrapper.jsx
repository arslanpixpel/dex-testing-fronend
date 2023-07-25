import React from "react";
import { StyledMain } from "./PageWrapper.style";

const PageWrapper = ({ children, className }) => {
    return (
        <StyledMain style={{ opacity: 0 }} className={className}>
            {children}
        </StyledMain>
    );
};

export default PageWrapper;
