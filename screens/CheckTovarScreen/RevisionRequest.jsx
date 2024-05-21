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
          keyExtractor={(item, index) => `${item.guid}${index}`}
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
});
