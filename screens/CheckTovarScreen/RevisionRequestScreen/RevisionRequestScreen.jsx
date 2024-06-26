////// hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// tags
import { SafeAreaView, FlatList, View } from "react-native";

////// helpers
import { getLocalDataUser } from "../../../helpers/returnDataUser";

////// fns
import { getRevisionRequest } from "../../../store/reducers/requestSlice";
import { changeLocalData } from "../../../store/reducers/saveDataSlice";

////// components
import { ListProdsRevision } from "../../../components/CheckProd/ListProdsRevision/ListProdsRevision";

////style
import styles from "./style";

export const RevisionRequestScreen = ({ navigation, route }) => {
  ////// каждый запрос других пр0давцов для подтверждения ревизии

  const dispatch = useDispatch();

  const { listRequestRevision } = useSelector((state) => state.requestSlice);
  const { data } = useSelector((state) => state.saveDataSlice);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(getRevisionRequest(data?.seller_guid));
  };

  useEffect(() => getData(), []);

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
