import classNames from "classnames";

export const MainButton = ({
  className,
  type = "button",
  disabled,
  isSelected,
  onClick,
  children,
  ...restProps
}) => {
  return (
    <button
      type={type}
      className={classNames({
        "flex items-center justify-center rounded-md cursor-pointer hover:bg-app-blue disabled:cursor-not-allowed": true,
        "bg-app-blue": isSelected,
        "bg-app-black-button": !isSelected,
        [className]: !!className,
      })}
      disabled={disabled}
      onClick={onClick}
      {...restProps}
    >
      {children}
    </button>
  );
};
