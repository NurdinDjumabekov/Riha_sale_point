////hooks
import { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

///tags
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView, Text, View } from "react-native";

/// components
import { ActionsEveryInvoice } from "../../../common/ActionsEveryInvoice/ActionsEveryInvoice";
import { EveryProduct } from "../EveryProduct/EveryProduct";

/////fns
import { getWorkShopsGorSale } from "../../../store/reducers/requestSlice";
import { changeSearchProd } from "../../../store/reducers/stateSlice";
import SaleMenu from "../../../common/SaleMenu/SaleMenu";

////style
import styles from "./style";

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
                  type={"sale"}
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
      <SaleMenu navigation={navigation} />
    </View>
  );
};
