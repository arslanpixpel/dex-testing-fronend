import { Link as RouterLink } from "react-router-dom";
import classNames from "classnames";

const Link = ({ to, linkStyle, selected, fontStyle, title, onClick, ...props }) => {
  return (
    <RouterLink
      to={to}
      className={classNames({
        [`${linkStyle} flex items-center justify-center rounded-md cursor-pointer hover:bg-app-blue`]: true,
        "bg-app-blue": selected,
        "bg-app-black-button": !selected,
      })}
      onClick={onClick}
      {...props}
    >
      <div className={fontStyle}>{title}</div>
    </RouterLink>
  );
};

export default Link;
