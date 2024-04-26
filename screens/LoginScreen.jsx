import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeDataLogin, clearLogin } from "../store/reducers/stateSlice";
import { ViewInput } from "../customsTags/ViewInput";
import { ViewContainer } from "../customsTags/ViewContainer";
import { ViewButton } from "../customsTags/ViewButton";
import { logInAccount } from "../store/reducers/requestSlice";
import { useEffect } from "react";
import { ViewImg } from "../customsTags/ViewImg";

export const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { dataLogin } = useSelector((state) => state.stateSlice);
  const { data } = useSelector((state) => state.saveDataSlice);

  const onChangeLogin = (text) => {
    dispatch(changeDataLogin({ ...dataLogin, login: text }));
  };

  const onChangePassword = (text) => {
    dispatch(changeDataLogin({ ...dataLogin, password: text }));
  };

  const sendLogin = () => {
    if (dataLogin?.login && dataLogin?.password) {
      dispatch(logInAccount({ dataLogin, navigation, data }));
    } else {
      alert("Введите логин и пароль!");
    }
  };

  useEffect(() => {
    dispatch(clearLogin());
  }, []);

  const link = "http://riha-operator.333.kg/image/rikha.png";

  return (
    <View styles={{ position: "relative" }}>
      <ViewContainer>
        <View>
          <ViewImg
            url={link}
            stylesImg={{
              width: 200,
              height: 100,
              objectFit: "contain",
              marginBottom: 20,
            }}
            stylesDiv={{
              display: "flex",
              alignItems: "center",
            }}
          />
          <ViewInput
            text="Введите логин"
            value={dataLogin?.login}
            onChangeText={onChangeLogin}
            placeholder="Ваш логин"
          />
          <ViewInput
            text="Введите пароль"
            value={dataLogin?.password}
            onChangeText={onChangePassword}
            placeholder="Ваш пароль"
            typePassword={true}
          />
        </View>
      </ViewContainer>
      <ViewButton onclick={sendLogin} styles={styles.loginBtn}>
        Войти
      </ViewButton>
    </View>
  );
};

const styles = StyleSheet.create({
  loginBtn: {
    backgroundColor: "rgba(47, 71, 190, 0.591)",
    backgroundColor: "#e5322d",
    position: "absolute",
    bottom: 30,
    left: 10,
    right: 10,
    minWidth: "90%",
    // elevation: 2,
    color: "#fff",
    marginTop: 0,
  },
});
