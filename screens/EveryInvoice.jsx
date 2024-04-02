import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  closeKassa,
  getCategoryTT,
  getProductTA,
} from "../store/reducers/requestSlice";
import { EveryProduct } from "../components/EveryProduct";
import { EveryCategoryInner } from "../components/TAComponents/EveryCategoryInner";
import { ViewButton } from "../customsTags/ViewButton";
import ConfirmationModal from "../components/ConfirmationModal";

export const EveryInvoice = ({ navigation }) => {
  const dispatch = useDispatch();
  const { preloader, listCategoryTA, listProductTA, isOpenKassa, infoKassa } =
    useSelector((state) => state.requestSlice);
  const [modal, setModal] = useState(false);

  const seller_guid = "e7458a29-6f7f-4364-a96d-ed878812f0cf";

  useEffect(() => {
    getData();
    navigation.setOptions({
      title: `${infoKassa?.date_system}`,
    });
    navigation.setParams({
      invoiceDate: (
        <ViewButton styles={styles.closeKassa} onclick={() => setModal(true)}>
          Закрыть кассу
        </ViewButton>
      ),
    });
  }, [infoKassa?.guid, isOpenKassa]);

  const close = () =>
    dispatch(closeKassa({ guid: infoKassa?.guid, navigation })); //  guid кассы

  const getData = async () => {
    await dispatch(getCategoryTT(seller_guid));
    await dispatch(
      getProductTA({
        guid: "0",
        seller_guid,
      })
    ); /// 0 - все продукты
  };

  // console.log(listProductTA, "listProductTA");
  // console.log(infoKassa, "infoKassa");

  const widthMax = { minWidth: "100%", width: "100%" };
  return (
    <>
      <View style={styles.container}>
        <SafeAreaView style={styles.parentBlock}>
          <View style={styles.parentSelectBlock}>
            <View style={styles.selectBlock}>
              <Text style={styles.textCateg}>Категории</Text>
              <FlatList
                contentContainerStyle={widthMax}
                data={listCategoryTA}
                renderItem={({ item }) => <EveryCategoryInner obj={item} />}
                keyExtractor={(item, ind) => `${item.guid}${ind}`}
                refreshControl={
                  <RefreshControl refreshing={preloader} onRefresh={getData} />
                }
              />
            </View>
          </View>
          <Text style={[styles.textCateg, styles.textTovar]}>Товары</Text>
          <FlatList
            contentContainerStyle={widthMax}
            data={listProductTA}
            renderItem={({ item, index }) => (
              <EveryProduct obj={item} index={index} />
            )}
            // keyExtractor={(item) => item.guid}
            keyExtractor={(item, ind) => `${item.guid}${ind}`}
            refreshControl={
              <RefreshControl refreshing={preloader} onRefresh={getData} />
            }
          />
        </SafeAreaView>
      </View>
      <ConfirmationModal
        visible={modal}
        message="Закрыть кассу ?"
        onYes={close}
        onNo={() => setModal(false)}
        onClose={() => setModal(false)}
      />
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
    marginTop: 5,
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
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    paddingBottom: 10,
    paddingTop: 10,
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
});
