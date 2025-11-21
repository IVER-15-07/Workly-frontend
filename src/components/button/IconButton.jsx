import PropTypes from "prop-types";

const VARIANTS = {
  primary: "primary",
  secondary: "secondary",
  danger: "danger",
  ghost: "ghost",
};

const SIZES = {
  small: "small",
  medium: "medium",
  large: "large",
};

const getVariantClasses = (variant) => {
  const variants = {
    primary: "bg-primary text-light hover:opacity-90",
    secondary: "bg-secondary text-black hover:opacity-90",
    danger: "bg-error text-light hover:opacity-90",
    ghost: "bg-transparent text-primary hover:bg-secondary",
  };
  return variants[variant] || variants.primary;
};

const getSizeClasses = (size) => {
  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };
  return sizes[size] || sizes.medium;
};

const IconButton = ({
  icon,
  variant = VARIANTS.primary,
  disabled = false,
  onClick,
  className = "",
  ...rest
}) => {
  const baseClasses = "inline-flex items-center justify-center p-3 border-none rounded-full cursor-pointer transition-all duration-300";
  const variantClasses = getVariantClasses(variant);
  const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : "hover:opacity-80";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
      {...rest}
    >
      {icon}
    </button>
  );
};

IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(Object.values(VARIANTS)),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export { IconButton };

//ejemplos
/*
<IconButton icon={<Heart size={20} />} variant="primary" />
<IconButton icon={<Trash size={20} />} variant="danger" />
<IconButton icon={<Settings size={20} />} variant="ghost" />
*/
