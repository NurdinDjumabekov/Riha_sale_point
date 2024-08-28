////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

////// tags
import { FlatList, Text, View } from "react-native";
import { TouchableOpacity, RefreshControl } from "react-native";

/////// fns
import { getListSoldProd } from "../../../store/reducers/requestSlice";
import { deleteSoldProd } from "../../../store/reducers/requestSlice";

////// components
import ConfirmationModal from "../../../common/ConfirmationModal/ConfirmationModal";
import SortDateSaleProd from "../../../components/SaleProd/SortDateSaleProd/SortDateSaleProd";

////// helpers
import { formatCount, sumtotalPrice } from "../../../helpers/amounts";

////style
import styles from "./style";

export const SoldProductScreen = ({ route, navigation }) => {
  //// список проданных продуктов
  const dispatch = useDispatch();
  const { guidInvoice } = route.params;
  const [modalItemGuid, setModalItemGuid] = useState(null); // Состояние для идентификатора элемента, для которого открывается модальное окно

  const { preloader, listSoldProd } = useSelector(
    (state) => state.requestSlice
  );
  const { seller_guid } = useSelector((state) => state.saveDataSlice.data);

  const getData = () => dispatch(getListSoldProd({ guidInvoice, seller_guid }));

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SortDateSaleProd seller_guid={seller_guid} guidInvoice={guidInvoice} />
      ),
      ///// только для продажи
    });

    getData();
  }, []);

  const del = (product_guid) => {
    dispatch(deleteSoldProd({ product_guid, getData }));
    setModalItemGuid(null);
  };

  const noneData = listSoldProd?.length == 0;

  if (noneData) {
    return <Text style={styles.noneData}>Список пустой</Text>;
  }

  return (
    <View style={[styles.parentSolds]}>
      <FlatList
        contentContainerStyle={styles.flatList}
        data={listSoldProd}
        renderItem={({ item, index }) => (
          <View style={styles.container}>
            <View style={styles.parentBlock}>
              <View style={styles.mainData}>
                <Text style={styles.titleNum}>{index + 1} </Text>
                <View>
                  <Text style={styles.titleDate}>{item.date || "..."}</Text>
                  <Text style={styles.totalPrice}>
                    {item?.product_price} сом х {item?.count} {item?.unit} ={" "}
                    {formatCount(item?.total)} сом
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.krest}
                onPress={() => setModalItemGuid(item?.guid)}
              >
                <View style={[styles.line, styles.deg]} />
                <View style={[styles.line, styles.degMinus]} />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.title}>{item?.product_name}</Text>
            </View>
            <ConfirmationModal
              visible={modalItemGuid === item.guid}
              message="Отменить продажу ?"
              onYes={() => del(item.guid)}
              onNo={() => setModalItemGuid(null)}
              onClose={() => setModalItemGuid(null)}
            />
          </View>
        )}
        keyExtractor={(item, index) => `${item.guid}${index}`}
        refreshControl={
          <RefreshControl refreshing={preloader} onRefresh={getData} />
        }
      />
      {!!!noneData && (
        <Text style={styles.totalSum}>
          Итоговая сумма: {sumtotalPrice(listSoldProd) || 0} сом
        </Text>
      )}
    </View>
  );
};
