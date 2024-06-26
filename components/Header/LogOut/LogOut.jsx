////// hooks
import { useDispatch } from "react-redux";
import { useState } from "react";

////// tags
import { TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

///// components
import ConfirmationModal from "../../../common/ConfirmationModal/ConfirmationModal";

///// fns
import { changePreloader } from "../../../store/reducers/requestSlice";
import { clearLocalData } from "../../../store/reducers/saveDataSlice";
import { clearLogin } from "../../../store/reducers/stateSlice";

////style
import styles from "./style";

export const LogOut = ({ navigation }) => {
  const [modal, setMoodal] = useState(false);
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(changePreloader(true));
    setTimeout(() => {
      navigation.navigate("Login");
      dispatch(changePreloader(false));
    }, 500);
    dispatch(clearLogin());
    clearAsyncStorage();
  };

  const clearAsyncStorage = async () => {
    dispatch(clearLocalData());
    ///// очищаю AsyncStorage
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Ошибка при очистке AsyncStorage:", error);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setMoodal(true)}
        style={styles.logoutParent}
      >
        <View style={styles.logoutInner}>
          <View style={styles.line}>
            <View style={styles.lineInner}></View>
          </View>
        </View>
      </TouchableOpacity>

      <ConfirmationModal
        visible={modal}
        message="Выйти c приложения ?"
        onYes={() => logOut()}
        onNo={() => setMoodal(false)}
        onClose={() => setMoodal(false)}
      />
    </>
  );
};
