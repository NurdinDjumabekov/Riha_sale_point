////// hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// tags
import { Text, View, FlatList } from "react-native";

////// components
import { RenderResult } from "../../../common/RenderResult/RenderResult";
import { getAcceptProdInvoiceRetrn } from "../../../store/reducers/requestSlice";
import ResultCounts from "../../../common/ResultCounts/ResultCounts";

////// helpers
import { formatCount } from "../../../helpers/amounts";

////style
import styles from "./style";

export const EveryReturnScreen = ({ route, navigation }) => {
  //// каждый возврат накладной типо истории
  const dispatch = useDispatch();
  const { codeid, guid } = route.params; /// guid - накладной

  const { listAcceptReturnProd } = useSelector((state) => state.requestSlice);

  useEffect(() => {
    navigation.setOptions({
      title: `Накладная №${codeid}`,
    });
    dispatch(getAcceptProdInvoiceRetrn(guid));
  }, []);
  const newList = listAcceptReturnProd?.[0]?.list;

  if (newList?.length === 0) {
    return <Text style={styles.noneData}>Данные отсутствуют</Text>;
  }

  return (
    <View style={styles.parent}>
      <FlatList
        contentContainerStyle={styles.flatList}
        data={newList}
        renderItem={({ item, index }) => (
          <RenderResult item={item} index={index} />
        )}
        keyExtractor={(item, index) => `${item.guid}${index}`}
      />
      <View style={styles.results}>
        <ResultCounts list={newList} />
        <Text style={styles.totalItemCount}>
          Сумма: {formatCount(listAcceptReturnProd?.[0]?.total_price)} сом
        </Text>
      </View>
    </View>
  );
};
