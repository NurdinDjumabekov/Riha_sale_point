import { StyleSheet, Image, View } from "react-native";
import userImg from "../../assets/icons/user.png";
import { Text } from "react-native";
import { getLocalDataUser } from "../../helpers/returnDataUser";
import { useEffect } from "react";
import { changeLocalData } from "../../store/reducers/saveDataSlice";
import { useDispatch, useSelector } from "react-redux";

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

const styles = StyleSheet.create({
  parentBlock: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  user: {
    width: 35,
    height: 35,
  },
  userRole: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 15,
    // color: "rgba(12, 169, 70, 0.9)",
  },
  userName: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 15,
    color: "rgba(47, 71, 190, 0.987)",
  },
});
