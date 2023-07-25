import React from "react";
import { StyledContainer } from "./Container.style";

const Container = ({ children, className }) => {
    return <StyledContainer className={className}>{children}</StyledContainer>;
};

export default Container;
