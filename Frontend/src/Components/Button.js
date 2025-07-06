const Button = ({ type = "button", onClick, disabled, children, className }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`w-full px-6 py-3 text-lg font-bold text-white bg-[#0A4B7E] rounded-lg hover:bg-red-700 transition duration-300 ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  