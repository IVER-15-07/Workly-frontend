import styled from "styled-components";

const StyledButton = styled.button`
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

const TextButton = ({ text, bgColor, textColor, shape, onClick }) => {
  return (
    <StyledButton
      bgColor={bgColor}
      textColor={textColor}
      shape={shape}
      onClick={onClick}
    >
      {text}
    </StyledButton>
  );
};

export default TextButton;
