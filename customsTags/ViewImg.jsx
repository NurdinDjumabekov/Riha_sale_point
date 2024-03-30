import { Image, View } from "react-native";

export const ViewImg = ({ url, stylesDiv, stylesImg }) => {
  // console.log(styles, "styles");
  // console.log(url, "url");
  return (
    <View
      style={[
        {
          minWidth: "100%",
        },
        stylesDiv || {},
      ]}
    >
      <Image
        style={[
          {
            width: 100,
            height: 100,
          },
          stylesImg || {},
        ]}
        source={{
          uri: url,
        }}
      />
    </View>
  );
};
