import styled from "styled-components";

const StyledButton = styled.button`
  background-color: ${({ $bgColor }) => $bgColor || "transparent"};
  color: ${({ $textColor }) => $textColor || "#333"};
  font-family: ${({ theme }) => theme?.typography?.fontFamily || "'Inter', sans-serif"};
  font-size: ${({ theme }) => theme?.typography?.button?.boldMedium?.fontSize || "16px"};
  font-weight: ${({ theme }) => theme?.typography?.button?.boldMedium?.fontWeight || 700};
  line-height: ${({ theme }) => theme?.typography?.button?.boldMedium?.lineHeight || "24px"};
  border: none;
  padding: 12px 24px;
  border-radius: ${({ $shape }) => $shape || "8px"};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const TextButton = ({ text, children, bgColor, textColor, shape, onClick, ...rest }) => {
  return (
    <StyledButton
      $bgColor={bgColor}
      $textColor={textColor}
      $shape={shape}
      onClick={onClick}
      {...rest}
    >
      {children ?? text}
    </StyledButton>
  );
};

export default TextButton;
