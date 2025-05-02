export const Button = ({
  children,
  onClick,
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-blue-600 text-white text-center py-3 font-medium transition-transform duration-300 hover:bg-blue-700 rounded-lg ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
