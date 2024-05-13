import { useCallback, useEffect } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryTT } from "../../store/reducers/requestSlice";
import { EveryProduct } from "../EveryProduct";
import { changeLocalData } from "../../store/reducers/saveDataSlice";
import { changeSearchProd } from "../../store/reducers/stateSlice";

import { ActionsEveryInvoice } from "../../common/ActionsEveryInvoice";
import { getLocalDataUser } from "../../helpers/returnDataUser";
import { SearchProdsSale } from "./SearchProdsSale";

export const EveryInvoiceSale = ({ forAddTovar, navigation }) => {
  const dispatch = useDispatch();
  const route = useRoute();

  /////////////////////////////////////////////////
  const checkComponent = route.name === "Shipment";
  /////////////////////////////////////////////////

  const { preloader, listCategory, listProductTT } = useSelector(
    (state) => state.requestSlice
  );
  const { data } = useSelector((state) => state.saveDataSlice);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    const sendData = { seller_guid: data?.seller_guid, type: "sale&&soputka" };
    dispatch(getCategoryTT({ ...sendData, checkComponent }));
    ////// внутри есть getProductTT
    dispatch(changeSearchProd(""));
    ////// очищаю поиск
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SearchProdsSale getData={getData} checkComponent={checkComponent} />
      ),
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const emptyData = listCategory?.length === 0;

  const emptyDataProd = listProductTT?.length === 0;

  if (emptyData) {
    return <Text style={styles.noneData}>Список пустой</Text>;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.parentBlock}>
        <ActionsEveryInvoice
          getData={getData}
          checkComponent={checkComponent}
        />
        <Text style={styles.textTovar}>Список товаров</Text>
        {emptyDataProd ? (
          <Text style={styles.noneData}>Список пустой</Text>
        ) : (
          <View style={styles.blockSelectProd}>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={preloader} onRefresh={getData} />
              }
            >
              {listProductTT?.map((item, index) => (
                <EveryProduct
                  key={item?.guid}
                  obj={item}
                  index={index}
                  checkComponent={checkComponent}
                  forAddTovar={forAddTovar}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  parentBlock: {
    flex: 1,
    position: "relative",
    backgroundColor: "rgba(162, 178, 238, 0.102)",
  },

  blockSelectProd: {
    flex: 1,
  },

  textTovar: {
    color: "#fff",
    padding: 8,
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 1,
    paddingBottom: 9,
    paddingTop: 9,
    backgroundColor: "rgba(47, 71, 190, 0.672)",
  },

  noneData: {
    paddingTop: 250,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
    height: "100%",
  },
});
