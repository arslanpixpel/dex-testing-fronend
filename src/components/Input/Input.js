import { useFormContext } from "react-hook-form";

// Input connected to form Provider
const Input = ({ name, type = "text", className, validation, ...restProps }) => {
  const { register } = useFormContext();

  return <input type={type} className={className} {...register(name, validation)} {...restProps} />;
};

export default Input;
