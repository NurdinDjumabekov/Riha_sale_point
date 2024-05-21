import { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getReturnHistory } from "../../store/reducers/requestSlice";
import { RenderResult } from "../../components/RenderResult";
import { totalLidtCountReturns } from "../../helpers/amounts";

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

const styles = StyleSheet.create({
  parentBlock: {
    paddingBottom: 70,
  },

  flatListStyle: {
    minWidth: "100%",
    width: "100%",
    paddingTop: 8,
  },

  result: {
    color: "#222",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "right",
    padding: 10,
  },

  noneData: {
    flex: 1,
    paddingTop: 300,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
  },
});
