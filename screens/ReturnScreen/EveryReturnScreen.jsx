////// hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// tags
import { StyleSheet, Text, View, FlatList } from "react-native";

////// components
import { RenderResult } from "../../components/RenderResult";
import { getAcceptProdInvoiceRetrn } from "../../store/reducers/requestSlice";

////// helpers
import { formatCount, unitResultFN } from "../../helpers/amounts";

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

  const totals = unitResultFN(newList);

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
        {(!!+totals?.totalKg || !!+totals?.totalSht) && (
          <Text style={styles.totalItemCount}>
            Итого:{" "}
            {!!+totals?.totalKg && `${formatCount(totals?.totalKg)} кг ,`}
            {!!+totals?.totalSht && `${formatCount(totals?.totalSht)} штук`}
          </Text>
        )}
        <Text style={styles.totalItemCount}>
          Сумма: {formatCount(listAcceptReturnProd?.[0]?.total_price)} сом
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    maxHeight: "98%",
  },

  flatList: {
    minWidth: "100%",
    width: "100%",
    paddingTop: 8,
    marginBottom: 15,
  },

  results: {
    paddingTop: 5,
  },

  totalItemCount: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgba(47, 71, 190, 0.991)",
    paddingHorizontal: 10,
  },

  noneData: {
    flex: 1,
    paddingTop: 300,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
  },
});
