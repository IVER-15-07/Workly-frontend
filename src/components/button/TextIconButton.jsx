import styled from "styled-components";

const StyledButton = styled.button
`  display: flex;
  align-items: center;
  gap: 8px; /* espacio entre icono y texto */
  background-color: ${({ bgColor }) => bgColor || "transparent"};
  color: ${({ textColor }) => textColor || "#333"};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.button.boldMedium.fontSize};
  font-weight: ${({ theme }) => theme.typography.button.boldMedium.fontWeight};
  line-height: ${({ theme }) => theme.typography.button.boldMedium.lineHeight};
  border: none;
  padding: 12px 24px;
  border-radius: ${({ shape }) => shape || "8px"};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const TextIconButton = ({ text, icon, bgColor, textColor, shape, onClick }) => {
  return (
    <StyledButton
      bgColor={bgColor}
      textColor={textColor}
      shape={shape}
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      {text}
    </StyledButton>
  );
};

export default TextIconButton;
//button con texto e icono, recibe props para personalizar colores, forma y manejador de click