import { useCallback } from "react";
import { RefreshControl } from "react-native";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryTT } from "../store/reducers/requestSlice";
import { EveryProduct } from "../components/EveryProduct";
import { EveryCategoryInner } from "../components/TAComponents/EveryCategoryInner";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native";

export const EveryInvoice = ({ forAddTovar }) => {
  const dispatch = useDispatch();
  const route = useRoute();

  /////////////////////////////////////////////////
  const checkComponent = route.name === "Shipment";
  /////////////////////////////////////////////////

  const { preloader, listCategory, listProductTT } = useSelector(
    (state) => state.requestSlice
  );
  const { data } = useSelector((state) => state.saveDataSlice);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    const dataObj = {
      checkComponent,
      seller_guid: data?.seller_guid,
      type: "sale&&soputka",
    };
    await dispatch(getCategoryTT(dataObj));
    //// внутри есть getProductTT
  };

  const emptyData = listCategory?.length === 0;

  if (emptyData) {
    return <Text style={styles.noneData}>Список пустой</Text>;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.parentBlock}>
        <View style={styles.parentSelectBlock}>
          <View style={styles.selectBlock}>
            <Text style={styles.textCateg}>Категории</Text>
            <ScrollView>
              {listCategory?.map((item) => (
                <EveryCategoryInner
                  key={item?.guid}
                  obj={item}
                  checkComponent={checkComponent}
                />
              ))}
            </ScrollView>
          </View>
        </View>
        <Text style={[styles.textCateg, styles.textTovar]}>Товары</Text>
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
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  parentSelectBlock: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  parentBlock: {
    flex: 1,
    position: "relative",
    backgroundColor: "rgba(162, 178, 238, 0.102)",
  },
  selectBlock: {
    backgroundColor: "#fff",
    marginTop: 3,
    marginBottom: 5,
    borderStyle: "solid",
    borderRadius: 3,
    width: "100%",
    maxHeight: 280,
  },

  textCateg: {
    padding: 8,
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 3,
    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 2,
    paddingBottom: 9,
    paddingTop: 9,
    backgroundColor: "#fff",
  },
  textTovar: {
    backgroundColor: "#fff",
  },
  closeKassa: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "green",
    borderRadius: 6,
    marginTop: 5,
  },
  blockSelectProd: {
    minHeight: "30%",
    overflow: "scroll",
    height: "52%",
  },
  paddingB50: {
    paddingBottom: 95,
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
