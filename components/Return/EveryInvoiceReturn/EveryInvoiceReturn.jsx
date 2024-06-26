/////// hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

////// tags
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

/////// fns
import { clearListProductTT } from "../../../store/reducers/requestSlice";
import { changeSearchProd } from "../../../store/reducers/stateSlice";

////// components
import { EveryProduct } from "../EveryProduct";
import { SearchProdsReturn } from "../SearchProdsReturn";
import { AddProductsInvoice } from "../AddProductsInvoice/AddProductsInvoice";

////// style
import styles from "./style";

export const EveryInvoiceReturn = ({ forAddTovar, navigation }) => {
  const dispatch = useDispatch();
  const route = useRoute();

  /////////////////////////////////////////////////
  const location = route.name;
  /////////////////////////////////////////////////

  const { preloader, listProductTT } = useSelector(
    (state) => state.requestSlice
  );

  const getData = () => {
    dispatch(changeSearchProd("")); ////// очищаю поиск
    dispatch(clearListProductTT()); ////// очищаю список товаров
  };

  useEffect(() => {
    getData();
    navigation.setOptions({
      headerRight: () => (
        <SearchProdsReturn getData={getData} location={location} />
      ),
    });
  }, []);

  const emptyDataProd = listProductTT?.length === 0;

  if (emptyDataProd) {
    return <Text style={styles.noneData}>Список пустой</Text>;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.parentBlock}>
        <Text style={styles.textTovar}>Список товаров</Text>
        {emptyDataProd ? (
          <Text style={styles.noneData}>Список пустой</Text>
        ) : (
          <View style={styles.blockSelectProd}>
            {/* <FlatList
              data={listProductTT}
              renderItem={({ item, index }) => (
                <EveryProduct obj={item} index={index} />
              )}
              keyExtractor={(item, index) => `${item?.guid}${index}`}
              refreshControl={
                <RefreshControl refreshing={preloader} onRefresh={getData} />
              }
            /> */}
          </View>
        )}
      </SafeAreaView>
      <AddProductsInvoice location={location} forAddTovar={forAddTovar} />
    </View>
  );
};
