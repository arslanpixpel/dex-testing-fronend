import { useFormContext } from "react-hook-form";

// Input connected to form Provider
const Input = ({ name, type = "text", className, validation, ...restProps }) => {
  const handleKeyDown = (e) => {
    // Check if the pressed key is 'e' or 'E' and prevent the input
    if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
    }
  };
  const { register } = useFormContext();
  return <input type={type} placeholder="0" onKeyDown={handleKeyDown} className={className} {...register(name, validation)} {...restProps} />;
};

export default Input;
