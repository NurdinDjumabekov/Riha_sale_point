import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getRevisionRequest } from "../../store/reducers/requestSlice";
import { getLocalDataUser } from "../../helpers/returnDataUser";
import { changeLocalData } from "../../store/reducers/saveDataSlice";
import { ListProdsRevision } from "./ListProdsRevision";

export const RevisionRequest = ({ navigation, route }) => {
  ////// каждый запрос других пр0давцов для подтверждения ревизии

  const dispatch = useDispatch();

  const { listRequestRevision } = useSelector((state) => state.requestSlice);
  const { data } = useSelector((state) => state.saveDataSlice);

  useEffect(() => getData(), []);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(getRevisionRequest(data?.seller_guid));
  };

  const widthMax = { minWidth: "100%", width: "100%" };

  console.log(listRequestRevision, "listRequestRevision");

  return (
    <SafeAreaView>
      <View style={styles.parentBlock}>
        <FlatList
          contentContainerStyle={widthMax}
          data={listRequestRevision}
          renderItem={({ item }) => (
            <ListProdsRevision
              item={item}
              navigation={navigation}
              disable={item?.status === 1 ? false : true}
            />
          )}
          keyExtractor={(item) => item.guid}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parentBlock: {
    minWidth: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 20,
  },

  ////// every

  container: {
    backgroundColor: "rgba(162, 178, 238, 0.102)",
    minWidth: "100%",
    padding: 8,
    paddingVertical: 20,
    paddingRight: 25,
    borderBottomWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  innerBlock: {
    display: "flex",
    width: "58%",
    gap: 5,
  },

  titleNum: {
    fontSize: 19,
    fontWeight: "700",
    color: "rgba(47, 71, 190, 0.672)",
    borderColor: "rgba(47, 71, 190, 0.672)",
    borderWidth: 1,
    backgroundColor: "#d4dfee",
    padding: 3,
    paddingLeft: 7,
    paddingRight: 0,
    borderRadius: 5,
  },

  titleDate: {
    fontSize: 14,
    fontWeight: "500",
    borderRadius: 5,
    lineHeight: 17,
  },

  role: {
    fontSize: 14,
    fontWeight: "500",
    borderRadius: 5,
    lineHeight: 17,
    color: "rgba(47, 71, 190, 0.672)",
  },

  mainData: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  arrow: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "rgba(162, 178, 238, 0.439)",
    height: 16,
    width: 16,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
  },
});
