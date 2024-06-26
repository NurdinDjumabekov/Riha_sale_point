/////// tags
import { Image, Text, TextInput, View } from "react-native";

////// hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// customsTags
import { ViewContainer } from "../../customsTags/ViewContainer";
import { ViewButton } from "../../customsTags/ViewButton";

////// fns
import { changeDataLogin, clearLogin } from "../../store/reducers/stateSlice";
import { logInAccount } from "../../store/reducers/requestSlice";

////imgs
import logoImg from "../../assets/images/riha.png";

////style
import styles from "./style";

export const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { dataLogin } = useSelector((state) => state.stateSlice);
  const { data } = useSelector((state) => state.saveDataSlice);

  const onChange = (type, text) => {
    dispatch(changeDataLogin({ ...dataLogin, [type]: text }));
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

  return (
    <View styles={{ position: "relative" }}>
      <ViewContainer>
        <View>
          <View style={styles.logoBlock}>
            <Image style={styles.logo} source={logoImg} />
          </View>
          <View>
            <Text style={styles.textInput}>Введите логин</Text>
            <TextInput
              value={dataLogin?.login}
              onChangeText={(text) => onChange("login", text)}
              placeholder={"Ваш логин"}
              style={styles.input}
            />
          </View>
          <View>
            <Text style={styles.textInput}>Введите пароль</Text>
            <TextInput
              value={dataLogin?.password}
              onChangeText={(text) => onChange("password", text)}
              placeholder={"Ваш пароль"}
              secureTextEntry={true}
              style={styles.input}
            />
          </View>
        </View>
      </ViewContainer>
      <ViewButton onclick={sendLogin} styles={styles.loginBtn}>
        Войти
      </ViewButton>
    </View>
  );
};
