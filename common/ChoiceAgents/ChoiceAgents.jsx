import { TouchableOpacity, Text } from "react-native";

////style
import styles from "./style";

export const ChoiceAgents = ({ item, setState, prev, keyGuid, keyText }) => {
  /////// для выбора агнетов

  const changeSelect = (value) => setState({ ...prev, [keyGuid]: value });

  return (
    <TouchableOpacity
      style={[
        styles.selectBlockInner,
        prev?.[keyGuid] === item?.[keyGuid] && styles.activeSelect,
      ]}
      onPress={() => changeSelect(item?.[keyGuid])}
    >
      <Text
        style={[
          styles.selectText,
          prev?.[keyGuid] === item?.[keyGuid] && styles.activeSelectText,
        ]}
      >
        {item?.[keyText]}
      </Text>
    </TouchableOpacity>
  );
};
