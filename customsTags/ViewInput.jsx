import { Text, View } from "react-native";

import styled from "styled-components/native";

const ViewTextInput = styled.TextInput`
  min-width: 100%;
  height: 50px;
  border-radius: 10px;
  margin: 10px auto;
  background-color: #fff;
  padding: 0 12px;
  font-size: 18px;
  elevation: 2;
`;

const TextLabel = styled.Text`
  padding: 0 5px;
  font-size: 20px;
  text-align: left;
`;

export const ViewInput = ({ value, onChangeText, placeholder, text }) => {
  return (
    <View>
      {text !== "" && <TextLabel>{text}</TextLabel>}
      <ViewTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        autoFocus={true}
      />
    </View>
  );
};
