import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ViewImg } from "../customsTags/ViewImg";
import { useDispatch } from "react-redux";
import { changePreloader } from "../store/reducers/requestSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { changeToken } from "../store/reducers/saveDataSlice";

export const LogOut = ({ navigation }) => {
  const dispatch = useDispatch();
  const imgLogOut =
    "https://www.kindpng.com/picc/m/19-194789_logout-button-png-transparent-png.png";

  const logOut = () => {
    dispatch(changePreloader(true));
    setTimeout(() => {
      dispatch(changeToken(""));
      navigation.navigate("Login");
      dispatch(changePreloader(false));
    }, 500);
  };

  return (
    <TouchableOpacity onPress={logOut} style={styles.logoutParent}>
      {/* <ViewImg
        url={imgLogOut}
        stylesImg={{
          width: 42,
          height: 40,
          objectFit: "contain",
          borderRadius: 20,
        }}
        stylesDiv={{
          // display: "flex",
          // alignItems: "center",
          minWidth: 40,
          width: 42,
          height: 40,
          backgroundColor: "rgba(199, 210, 254, 0.250)",
          borderRadius: 20,
        }}
      /> */}
      <View style={styles.logoutInner}>
        <View style={styles.line}>
          <View style={styles.lineInner}></View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutParent: {
    // backgroundColor: "red",
    width: 40,
    height: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutInner: {
    position: "relative",
    width: "70%",
    height: "70%",
    borderWidth: 4,
    borderRadius: 20,
    borderColor: "rgba(47, 71, 190, 0.591)",
    // borderColor: "red",
    display: "flex",
    alignItems: "center",
  },

  line: {
    backgroundColor: "#fff",
    padding: 3,
    paddingLeft: 4,
    paddingRight: 4,
    position: "absolute",
    top: -9,
  },
  lineInner: {
    width: 5,
    height: 17,
    backgroundColor: "rgba(47, 71, 190, 0.591)",
    // backgroundColor: "red",
    borderRadius: 5,
  },
});
