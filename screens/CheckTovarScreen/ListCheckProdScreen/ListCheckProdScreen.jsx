///// hooks
import { useEffect } from "react";

///// tags
import { FlatList, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

///// fns
import { getReturnHistory } from "../../../store/reducers/requestSlice";

///// components
import { RenderResult } from "../../../common/RenderResult/RenderResult";

/////// helpers
import { totalLidtCountReturns } from "../../../helpers/amounts";

////style
import styles from "./style";

export const ListCheckProdScreen = ({ route, navigation }) => {
  //// каждая накладная (список воозврата накладной) типо истории
  const dispatch = useDispatch();
  const { obj, title } = route.params;

  const { listProdReturn } = useSelector((state) => state.requestSlice);

  useEffect(() => {
    dispatch(getReturnHistory(obj?.guid));
    navigation.setOptions({ title });
    /// "Накладная №***
  }, []);

  return (
    <>
      {listProdReturn?.[0]?.list?.length === 0 ? (
        <Text style={styles.noneData}>Данные отсутствуют</Text>
      ) : (
        <View style={styles.parentBlock}>
          <FlatList
            contentContainerStyle={styles.flatListStyle}
            data={listProdReturn?.[0]?.list}
            renderItem={({ item, index }) => (
              <RenderResult item={item} index={index} />
            )}
            keyExtractor={(item, index) => `${item.guid}${index}`}
          />
          <Text style={styles.result}>
            Итого: {totalLidtCountReturns(listProdReturn?.[0]?.list)} сом
          </Text>
        </View>
      )}
    </>
  );
};
