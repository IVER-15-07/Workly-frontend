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
    ghost: "bg-transparent text-primary hover:bg-Light",
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

const Button = ({
  variant = VARIANTS.primary,
  size = SIZES.medium,
  disabled = false,
  children,
  onClick,
  type = "button",
  className = "",
  bgColor = null,
  textColor = null,
  borderRadius = null,
  opacity = null,
  hoverBg = null,
  hoverText = null,
  ...rest
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-sans font-bold border-none cursor-pointer transition-all duration-300";

  const customBgColor = bgColor ? bgColor : "";
  const customTextColor = textColor ? textColor : "";
  const variantClasses = bgColor || textColor
    ? `${customBgColor} ${customTextColor}`
    : getVariantClasses(variant);

  const sizeClasses = getSizeClasses(size);

  const customBorderRadius = borderRadius || "rounded-button";

  const opacityClass = opacity ? `opacity-${opacity}` : "";
  const hoverBgClass = hoverBg || "";
  const hoverTextClass = hoverText || "";

  const disabledClasses = disabled
    ? "opacity-60 cursor-not-allowed"
    : "hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0";


  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${customBorderRadius} ${opacityClass} ${hoverBgClass} ${hoverTextClass}  ${disabledClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(Object.values(VARIANTS)),
  size: PropTypes.oneOf(Object.values(SIZES)),
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  bgColor: PropTypes.string,       // Personalizado: "bg-blue-500"
  textColor: PropTypes.string,     // Personalizado: "text-white"
  borderRadius: PropTypes.string,  // Personalizado: "rounded-full"
  opacity: PropTypes.oneOf([25, 50, 75, 100]), // Personalizado: 75
  hoverBg: PropTypes.string,
  hoverText: PropTypes.string,

};

export { Button };

//ejemplos
/*
<Button 
  bgColor="bg-purple-500" 
  textColor="text-yellow-200"
  borderRadius="rounded-lg"
  opacity={90}
  size="large"
>

<Button>Crear Cuenta</Button>
<Button variant="secondary" size="small">Cancelar</Button>
<Button variant="danger" size="large" disabled>Eliminar</Button>
<Button type="submit">Enviar</Button>
*/