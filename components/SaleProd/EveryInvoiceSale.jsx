////hooks
import { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

///tags
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

/// components
import { ActionsEveryInvoice } from "../../common/ActionsEveryInvoice";
import { AddProductsTA } from "../TAComponents/AddProductsTA";
import { EveryProduct } from "../EveryProduct";

/////fns
import { getWorkShopsGorSale } from "../../store/reducers/requestSlice";
import { changeSearchProd } from "../../store/reducers/stateSlice";
import IconsDisableSearch from "./IconsDisableSearch";

export const EveryInvoiceSale = ({ forAddTovar, navigation }) => {
  const dispatch = useDispatch();
  const route = useRoute();

  /////////////////////////////////////////////////
  const location = route.name;
  /////////////////////////////////////////////////

  const { preloader, listProductTT } = useSelector(
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

  useEffect(() => {
    getData();

    navigation.setOptions({
      headerRight: () => <IconsDisableSearch navigation={navigation} />,
    });
  }, []);

  const emptyDataProd = listProductTT?.length === 0;

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
                <EveryProduct
                  obj={item}
                  index={index}
                  navigation={navigation}
                />
              )}
              keyExtractor={(item, index) => `${item?.guid}${index}`}
              refreshControl={
                <RefreshControl refreshing={preloader} onRefresh={getData} />
              }
            />
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
