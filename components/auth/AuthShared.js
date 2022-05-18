import styled from "styled-components/native";

export const TextInput = styled.TextInput`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 15px 8px;
  margin-bottom: 8px;
  border-radius: 5px;
  color: white;
  margin-bottom: ${(props) => (props.lastOne ? "15" : 8)}px;
`;
