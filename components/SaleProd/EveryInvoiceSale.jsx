import { useCallback, useEffect } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getWorkShopsGorSale } from "../../store/reducers/requestSlice";
import { EveryProduct } from "../EveryProduct";
import { changeLocalData } from "../../store/reducers/saveDataSlice";
import { changeSearchProd } from "../../store/reducers/stateSlice";

import { ActionsEveryInvoice } from "../../common/ActionsEveryInvoice";
import { getLocalDataUser } from "../../helpers/returnDataUser";
import { SearchProdsSale } from "./SearchProdsSale";
import { AddProductsTA } from "../TAComponents/AddProductsTA";

export const EveryInvoiceSale = ({ forAddTovar, navigation }) => {
  const dispatch = useDispatch();
  const route = useRoute();

  /////////////////////////////////////////////////
  const location = route.name;
  /////////////////////////////////////////////////

  const { preloader, listCategory, listProductTT } = useSelector(
    (state) => state.requestSlice
  );
  const { data } = useSelector((state) => state.saveDataSlice);

  const getData = () => {
    const sendData = { seller_guid: data?.seller_guid, type: "sale" };
    // ////// внутри есть getCategoryTT и getProductTT
    dispatch(getWorkShopsGorSale({ ...sendData, location }));

    dispatch(changeSearchProd(""));
    ////// очищаю поиск
  };

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <SearchProdsSale getData={getData} location={location} />
  //     ),
  //   });
  // }, []);

  useEffect(() => {
    getData();
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //   }, [])
  // );

  const emptyData = listCategory?.length === 0;

  const emptyDataProd = listProductTT?.length === 0;

  // if (emptyData) {
  //   return <Text style={styles.noneData}>Список пустой</Text>;
  // }

  // console.log(listProductTT, "listProductTT");

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.parentBlock}>
        <ActionsEveryInvoice location={location} type={"sale"} />
        <Text style={styles.textTovar}>Список товаров</Text>
        {emptyDataProd ? (
          <Text style={styles.noneData}>Список пустой</Text>
        ) : (
          <View style={styles.blockSelectProd}>
            <FlatList
              data={listProductTT}
              renderItem={({ item, index }) => (
                <EveryProduct obj={item} index={index} />
              )}
              keyExtractor={(item, index) => `${item?.guid}${index}`}
              refreshControl={
                <RefreshControl refreshing={preloader} onRefresh={getData} />
              }
            />
          </View>
        )}
      </SafeAreaView>
      <AddProductsTA location={location} forAddTovar={forAddTovar} />
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
    paddingBottom: 10,
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
