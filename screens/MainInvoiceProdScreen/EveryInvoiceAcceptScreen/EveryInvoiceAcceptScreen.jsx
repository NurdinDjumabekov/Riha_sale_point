////// hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// tags
import { Text, View, FlatList } from "react-native";

////// components
import { RenderResult } from "../../../components/RenderResult";
import { getAcceptProdInvoice } from "../../../store/reducers/requestSlice";

////// helpers
import { formatCount } from "../../../helpers/amounts";
import ResultCounts from "../../../common/ResultCounts/ResultCounts";

////style
import styles from "./style";

export const EveryInvoiceAcceptScreen = ({ route, navigation }) => {
  //// каждый возврат накладной типо истории
  const dispatch = useDispatch();
  const { codeid, guid } = route.params; /// guid - накладной

  const { listAcceptInvoiceProd } = useSelector((state) => state.requestSlice);

  useEffect(() => {
    navigation.setOptions({
      title: `Накладная №${codeid}`,
    });

    dispatch(getAcceptProdInvoice(guid));
  }, []);
  const newList = listAcceptInvoiceProd?.[0]?.list;

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
          Сумма: {formatCount(listAcceptInvoiceProd?.[0]?.total_price)} сом
        </Text>
      </View>
    </View>
  );
};
