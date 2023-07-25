import React from "react";
import { StyledButton } from "./Button.style";

const Button = ({ children, variant, disabled, onClick, ...rest }) => {
    return (
        <StyledButton variant={variant} disabled={disabled} onClick={onClick} {...rest}>
            {children}
        </StyledButton>
    );
};

export default Button;
