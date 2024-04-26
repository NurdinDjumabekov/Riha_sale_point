import { TouchableWithoutFeedback } from "react-native";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";

export const ViewButton = ({ children, styles, onclick }) => {
  // console.log(styles, "styles");
  return (
    <TouchableWithoutFeedback onPress={onclick}>
      <Text
        style={[
          {
            textAlign: "center",
            paddingBottom: 12,
            paddingTop: 12,
            margin: "auto",
            marginTop: 10,
            borderRadius: 10,
            fontSize: 20,
            backgroundColor: styles?.backgroundColor || "#000",
            fontWeight: 700,
            // marginHorizontal: 80,
            // minWidth: "100%",
            // width: 250,
          },
          styles,
        ]}
      >
        {children}
      </Text>
    </TouchableWithoutFeedback>
  );
};
