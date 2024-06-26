///tags
import { Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

///// hooks
import { useDispatch, useSelector } from "react-redux";

/////fns
import { getProductTT, getCategoryTT } from "../../store/reducers/requestSlice";
import { clearLeftovers } from "../../store/reducers/requestSlice";
import { getMyLeftovers } from "../../store/reducers/requestSlice";
import { clearListCategory } from "../../store/reducers/requestSlice";
import { clearListProductTT } from "../../store/reducers/requestSlice";
import { changeActiveSelectCategory } from "../../store/reducers/stateSlice";
import { clearTemporaryData } from "../../store/reducers/stateSlice";
import { changeActiveSelectWorkShop } from "../../store/reducers/stateSlice";
import { changeSearchProd } from "../../store/reducers/stateSlice";

////style
import styles from "./style";

export const ActionsEveryInvoice = ({ location, type }) => {
  const dispatch = useDispatch();

  const { listCategory, listWorkShopSale } = useSelector(
    (state) => state.requestSlice
  );

  const { activeSelectCategory, activeSelectWorkShop } = useSelector(
    (state) => state.stateSlice
  );

  const { data } = useSelector((state) => state.saveDataSlice);

  const { seller_guid } = data;

  const onChangeWorkShop = (value) => {
    if (value !== activeSelectCategory) {
      dispatch(clearListCategory()); //// очищаю список категорий перед отправкой запроса
      const send = { seller_guid, type, workshop_guid: value };

      setTimeout(() => {
        dispatch(getCategoryTT({ ...send, location }));
      }, 300);

      dispatch(changeActiveSelectWorkShop(value));
      /// хранение активной категории, для сортировки товаров(храню guid категории)
      clear();
    }
  };

  const onChangeCateg = (value) => {
    if (value !== activeSelectCategory) {
      dispatch(clearListProductTT()); //// очищаю список товаров перед отправкой запроса
      dispatch(clearLeftovers()); //// очищаю массив данныз остатков
      dispatch(changeActiveSelectCategory(value));

      setTimeout(() => {
        if (type == "sale") {
          const obj = { workshop_guid: activeSelectWorkShop, location };
          dispatch(getProductTT({ ...obj, guid: value, seller_guid }));
        } else if (type == "leftovers") {
          const obj = { workshop_guid: activeSelectWorkShop, seller_guid };
          dispatch(getMyLeftovers({ ...obj, category_guid: value }));
        }
      }, 300);

      /// хранение активной категории, для сортировки товаров(храню guid категории)
      clear();
    }
  };

  const clear = () => {
    dispatch(changeSearchProd(""));
    ////// очищаю поиск
    dispatch(clearTemporaryData());
    ////// очищаю временный данные для продажи
  };

  // console.log(activeSelectCategory, "activeSelectCategory");
  // console.log(activeSelectWorkShop, "activeSelectWorkShop");
  // console.log(listCategory, "listCategory");

  return (
    <View style={styles.parentSelects}>
      <Text style={styles.choiceCateg}>Выберите цех</Text>
      <View style={styles.blockSelect}>
        <RNPickerSelect
          onValueChange={onChangeWorkShop}
          items={listWorkShopSale}
          useNativeAndroidPickerStyle={false}
          value={activeSelectWorkShop}
          // placeholder={{}}
          style={styles}
        />
        <View style={styles.arrow}></View>
      </View>
      <Text style={styles.choiceCateg}>Выберите категорию</Text>
      <View style={styles.blockSelect}>
        <RNPickerSelect
          onValueChange={onChangeCateg}
          items={listCategory}
          useNativeAndroidPickerStyle={false}
          value={activeSelectCategory}
          // placeholder={{}}
          style={styles}
        />
        <View style={styles.arrow}></View>
      </View>
    </View>
  );
};
