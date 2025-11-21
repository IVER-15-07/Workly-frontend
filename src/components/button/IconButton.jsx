import styled from "styled-components";

const StyledIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ bgColor }) => bgColor || "transparent"};
  color: ${({ iconColor }) => iconColor || "#333"};
  border: none;
  padding: 12px;
  border-radius: ${({ shape }) => shape || "50%"}; /* por defecto circular */
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const IconButton = ({ icon, bgColor, iconColor, shape, onClick }) => {
  return (
    <StyledIconButton
      bgColor={bgColor}
      iconColor={iconColor}
      shape={shape}
      onClick={onClick}
    >
      {icon}
    </StyledIconButton>
  );
};

export default IconButton;
