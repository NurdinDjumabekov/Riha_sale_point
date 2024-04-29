import { useCallback } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { RefreshControl, TextInput, ScrollView } from "react-native";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategoryTT,
  getProductTT,
  searchProdTT,
} from "../store/reducers/requestSlice";
import { EveryProduct } from "../components/EveryProduct";
import { getLocalDataUser } from "../helpers/returnDataUser";
import { changeLocalData } from "../store/reducers/saveDataSlice";
import {
  changeActiveSelectCategory,
  changeSearchProd,
  changeStateForCategory,
  changeTemporaryData,
} from "../store/reducers/stateSlice";

import RNPickerSelect from "react-native-picker-select";
import { ViewButton } from "../customsTags/ViewButton";
import { Alert } from "react-native";

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

  const { activeSelectCategory, searchProd } = useSelector(
    (state) => state.stateSlice
  );

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    const sendData = { seller_guid: data?.seller_guid, type: "sale&&soputka" };
    dispatch(getCategoryTT({ ...sendData, checkComponent }));
    ////// внутри есть getProductTT
    dispatch(changeSearchProd(""));
    ////// очищаю поиск
  };

  const handleValueChange = (value) => {
    getLocalDataUser({ changeLocalData, dispatch });
    const sendData = { guid: value, seller_guid: data?.seller_guid };
    dispatch(getProductTT({ ...sendData, checkComponent }));

    dispatch(changeStateForCategory(value));
    dispatch(changeTemporaryData({}));
    ///// checkcheck

    dispatch(changeActiveSelectCategory(value));
    /// хранение активной категории, для сортировки товаров(храню guid категории)
    // dispatch(changeSearchProd(""));
    ////// очищаю поиск
  };

  const onChange = (text) => {
    if (text === "") {
      getData();
    } else {
      dispatch(changeSearchProd(text));
    }
  };

  const searchData = () => {
    if (searchProd === "") {
      Alert.alert("Введите текст!");
    } else {
      getLocalDataUser({ changeLocalData, dispatch });
      const sendData = { searchProd, seller_guid: data?.seller_guid };
      dispatch(searchProdTT({ ...sendData, checkComponent }));
    }
  };

  const emptyData = listCategory?.length === 0;

  if (emptyData) {
    return <Text style={styles.noneData}>Список пустой</Text>;
  }

  // console.log(activeSelectCategory, "activeSelectCategory");
  // console.log(searchProd, "searchProd ");

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.parentBlock}>
        <View style={styles.blockSearch}>
          <TextInput
            style={styles.inputSearch}
            placeholderTextColor={"rgba(47, 71, 190, 0.591)"}
            placeholder="Поиск товаров"
            onChangeText={onChange}
            value={searchProd}
          />
          <ViewButton onclick={searchData} styles={styles.blockBtn}>
            Поиск
          </ViewButton>
        </View>
        <Text style={styles.choiceCateg}>Выберите категорию</Text>
        <View style={styles.blockSelect}>
          <RNPickerSelect
            onValueChange={handleValueChange}
            items={listCategory}
            value={activeSelectCategory}
            placeholder={{}}
          />
        </View>
        <Text style={styles.textTovar}>Список товаров</Text>
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

  parentBlock: {
    flex: 1,
    position: "relative",
    backgroundColor: "rgba(162, 178, 238, 0.102)",
  },

  blockSelect: {
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.591)",
    width: "96%",
    alignSelf: "center",
    borderRadius: 5,
    marginBottom: 10,
    height: 55,
  },

  blockSelectProd: {
    flex: 1,
  },

  choiceCateg: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    width: "95%",
    alignSelf: "center",
    paddingBottom: 3,
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

  /////////// search

  blockSearch: {
    position: "relative",
    width: "96%",
    alignSelf: "center",
  },

  inputSearch: {
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.591)",
    borderRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    paddingRight: 110,
  },

  blockBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    width: 100,
    height: 50,
    backgroundColor: "rgba(47, 71, 190, 0.591)",
    borderWidth: 1,
    color: "#fff",
    borderColor: "rgba(47, 71, 190, 0.591)",
    borderLeftWidth: 0,
    lineHeight: 25,
  },

  /////////// search

  noneData: {
    paddingTop: 250,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    color: "#222",
    height: "100%",
  },
});
