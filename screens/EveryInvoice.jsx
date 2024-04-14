import { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryTT, getProductTT } from "../store/reducers/requestSlice";
import { EveryProduct } from "../components/EveryProduct";
import { EveryCategoryInner } from "../components/TAComponents/EveryCategoryInner";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";

export const EveryInvoice = () => {
  const dispatch = useDispatch();
  const { preloader, listCategory, listProductTT, infoKassa } = useSelector(
    (state) => state.requestSlice
  );
  const { data } = useSelector((state) => state.saveDataSlice);
  const [openKeyBoard, setOpenKeyBoard] = useState(false);

  // const seller_guid = "e7458a29-6f7f-4364-a96d-ed878812f0cf";

  useEffect(() => {
    getData();
  }, [infoKassa?.guid]);

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    await dispatch(getCategoryTT(data?.seller_guid));
    await dispatch(
      getProductTT({
        guid: "0",
        seller_guid: data?.seller_guid,
      })
    ); /// 0 - все продукты
  };

  useEffect(() => {
    /// события открытия клавиатуры
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setOpenKeyBoard(true)
    );
    /// события закрытия клавиатуры
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setOpenKeyBoard(false)
    );
    // Удаление слушателей после использования
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const checkLength = listProductTT?.length <= 4;

  const emptyData = listCategory?.length >= 1 && listProductTT?.length === 0;

  const widthMax = { minWidth: "100%", width: "100%" };
  return (
    <>
      {emptyData ? (
        <Text style={styles.noneData}>Список пустой</Text>
      ) : (
        <View style={styles.container}>
          <SafeAreaView style={styles.parentBlock}>
            <View style={styles.parentSelectBlock}>
              <View style={styles.selectBlock}>
                <Text style={styles.textCateg}>Категории</Text>
                <FlatList
                  contentContainerStyle={widthMax}
                  data={listCategory}
                  renderItem={({ item }) => <EveryCategoryInner obj={item} />}
                  keyExtractor={(item, ind) => `${item.guid}${ind}`}
                  // refreshControl={
                  //   <RefreshControl refreshing={preloader} onRefresh={getData} />
                  // }
                />
              </View>
            </View>
            <Text style={[styles.textCateg, styles.textTovar]}>Товары</Text>
            <View
              style={[
                styles.blockSelectProd,
                openKeyBoard && checkLength && styles.paddingB50,
              ]}
            >
              <FlatList
                contentContainerStyle={widthMax}
                data={listProductTT}
                renderItem={({ item, index }) => (
                  <EveryProduct obj={item} index={index} />
                )}
                keyExtractor={(item, ind) => `${item.guid}${ind}`}
                refreshControl={
                  <RefreshControl refreshing={preloader} onRefresh={getData} />
                }
              />
            </View>
          </SafeAreaView>
        </View>
      )}
    </>
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
    height: "48%",
  },
  paddingB50: {
    // paddingBottom: 95,
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
