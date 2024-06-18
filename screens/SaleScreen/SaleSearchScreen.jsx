///hooks
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

///tags
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";

/////components
import { SearchProdsSale } from "../../components/SaleProd/SearchProdsSale";
import { EveryProduct } from "../../components/EveryProduct";

////fns
import { clearListProdSearch } from "../../store/reducers/requestSlice";

const SaleSearchScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { listProdSearch } = useSelector((state) => state.requestSlice);

  const { infoKassa } = useSelector((state) => state.requestSlice);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <SearchProdsSale />,
      ///// только для продажи
    });

    return () => dispatch(clearListProdSearch());
  }, []);

  const emptyDataProd = listProdSearch?.length === 0;

  const listProdSale = () => {
    navigation.navigate("SoldProduct", {
      navigation,
      guidInvoice: infoKassa?.guid,
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.parentBlock}>
        <TouchableOpacity onPress={listProdSale} style={styles.arrow}>
          <Text style={styles.textBtn}>Список продаж</Text>
          <View style={styles.arrowInner}></View>
        </TouchableOpacity>
        {emptyDataProd ? (
          <Text style={styles.noneData}>Список пустой</Text>
        ) : (
          <View style={styles.blockSelectProd}>
            <FlatList
              data={listProdSearch}
              renderItem={({ item, index }) => (
                <EveryProduct
                  obj={item}
                  index={index}
                  navigation={navigation}
                  type={"sale"}
                />
              )}
              keyExtractor={(item, index) => `${item?.guid}${index}`}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default SaleSearchScreen;

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

  arrow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingTop: 11,
    paddingBottom: 11,
    backgroundColor: "rgba(12, 169, 70, 0.486)",
    marginBottom: 0,
  },

  arrowInner: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#fff",
    height: 15,
    width: 15,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
    marginRight: 20,
    marginTop: 5,
  },

  textBtn: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },

  noneData: {
    paddingTop: 250,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
    height: "100%",
  },

  searchBlock: {
    height: 45,
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 0,
    marginRight: -20,
  },

  iconSearch: {
    width: 30,
    height: 30,
  },
});
