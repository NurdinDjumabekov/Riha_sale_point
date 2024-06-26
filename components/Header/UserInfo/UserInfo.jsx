////// tags
import { Image, View, Text } from "react-native";

////// imgs
import userImg from "../../../assets/icons/user.png";

////// helpers
import { getLocalDataUser } from "../../../helpers/returnDataUser";

////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

////// components
import { changeLocalData } from "../../../store/reducers/saveDataSlice";

////style
import styles from "./style";

const UserInfo = () => {
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.saveDataSlice);

  useEffect(() => {
    getLocalDataUser({ changeLocalData, dispatch });
  }, []);

  return (
    <View style={styles.parentBlock}>
      <Image style={styles.user} source={userImg} />
      <View>
        <Text style={styles.userRole}>Продавец</Text>
        <Text style={styles.userName}>{data?.seller_fio}</Text>
      </View>
    </View>
  );
};

export default UserInfo;
