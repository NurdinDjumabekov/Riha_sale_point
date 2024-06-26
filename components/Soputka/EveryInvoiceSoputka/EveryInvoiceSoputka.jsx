/////// hooks
import { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { FlatList, RefreshControl } from "react-native";

///// tags
import { SafeAreaView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

///// fns
import { clearListProductTT } from "../../../store/reducers/requestSlice";
import { changeSearchProd } from "../../../store/reducers/stateSlice";

///// components
import { EveryProduct } from "../../SaleProd/EveryProduct/EveryProduct";
import { SearchProdsSoputka } from "../SearchProdsSoputka/SearchProdsSoputka";
import { AddProductsInvoice } from "../../../common/AddProductsInvoice/AddProductsInvoice";

////style
import styles from "./style";

export const EveryInvoiceSoputka = ({ forAddTovar, navigation }) => {
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
        <SearchProdsSoputka getData={getData} location={location} />
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
            <FlatList
              data={listProductTT}
              renderItem={({ item, index }) => (
                <EveryProduct
                  obj={item}
                  index={index}
                  type={"soputka"}
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
      <AddProductsInvoice location={location} forAddTovar={forAddTovar} />
    </View>
  );
};
