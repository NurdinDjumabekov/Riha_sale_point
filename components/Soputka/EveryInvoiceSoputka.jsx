import { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearListProductTT } from "../../store/reducers/requestSlice";
import { EveryProduct } from "../EveryProduct";
import { changeSearchProd } from "../../store/reducers/stateSlice";
import { SearchProdsSoputka } from "./SearchProdsSoputka";

export const EveryInvoiceSoputka = ({ forAddTovar, navigation }) => {
  const dispatch = useDispatch();
  const route = useRoute();

  /////////////////////////////////////////////////
  const checkComponent = route.name === "Shipment";
  /////////////////////////////////////////////////

  const { preloader, listProductTT } = useSelector(
    (state) => state.requestSlice
  );
  const { data } = useSelector((state) => state.saveDataSlice);

  const getData = () => {
    dispatch(changeSearchProd("")); ////// очищаю поиск
    dispatch(clearListProductTT()); ////// очищаю список товаров
  };

  useEffect(() => {
    getData();
    navigation.setOptions({
      headerRight: () => (
        <SearchProdsSoputka getData={getData} checkComponent={checkComponent} />
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
