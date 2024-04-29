import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ViewButton } from '../../customsTags/ViewButton';
import {
  changeDataInputsInv,
  changeTemporaryData,
} from '../../store/reducers/stateSlice';
import {
  addProductInvoiceTT,
  addProductSoputkaTT,
  getCategoryTT,
} from '../../store/reducers/requestSlice';
import { getLocalDataUser } from '../../helpers/returnDataUser';
import { changeLocalData } from '../../store/reducers/saveDataSlice';
import { Modal } from 'react-native';
import { Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';

export const AddProductsTA = (props) => {
  const { productGuid, checkComponent, forAddTovar, isCheck, obj } = props;

  //// для добавления продуктов в список
  ///  checkComponent - true значит сопутка false - продажа
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.saveDataSlice);

  const { dataInputsInv } = useSelector((state) => state.stateSlice);
  const { infoKassa } = useSelector((state) => state.requestSlice);

  const onChange = (name, text) => {
    if (/^\d*\.?\d*$/.test(text)) {
      dispatch(changeDataInputsInv({ ...dataInputsInv, [name]: text }));
    }
  };

  const addInInvoice = () => {
    if (
      dataInputsInv?.price === '' ||
      dataInputsInv?.ves === '' ||
      dataInputsInv?.price == 0 ||
      dataInputsInv?.ves == 0
    ) {
      Alert.alert('Введите цену и вес (кол-во)!');
    } else {
      const data = {
        guid: productGuid,
        count: dataInputsInv?.ves,
        price: dataInputsInv?.price,
        invoice_guid: infoKassa?.guid,
      };
      if (checkComponent) {
        /// продажа
        dispatch(addProductInvoiceTT({ data, getData }));
      } else {
        /// сопутка
        const obj = { ...data, ...forAddTovar };
        dispatch(addProductSoputkaTT({ obj, getData }));
      }
    }
  };

  const getData = async () => {
    await getLocalDataUser({ changeLocalData, dispatch });
    const dataObj = {
      checkComponent,
      seller_guid: data?.seller_guid,
      type: 'sale&&soputka',
    };
    await dispatch(getCategoryTT(dataObj));
  }; /// для вызова категорий и продуктов

  const onClose = () => {
    dispatch(changeTemporaryData({}));
  };
  // console.log(obj?.product_name);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isCheck}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.parennt}>
          <View style={styles.child}>
            <Text style={styles.title}>{obj?.product_name}</Text>
            <TouchableOpacity style={styles.krest} onPress={() => onClose()}>
              <View style={[styles.line, styles.deg]} />
              <View style={[styles.line, styles.degMinus]} />
            </TouchableOpacity>
            {checkComponent && isCheck && (
              <Text style={styles.leftovers}>Остаток: {obj.end_outcome}</Text>
            )}

            <View style={styles.addDataBlock}>
              <TextInput
                style={styles.input}
                value={`${dataInputsInv?.price?.toString()} сом`}
                onChangeText={(text) => onChange('price', text)}
                keyboardType="numeric"
                placeholder="Цена"
                maxLength={8}
              />
              <TextInput
                style={styles.input}
                value={dataInputsInv?.ves}
                onChangeText={(text) => onChange('ves', text)}
                keyboardType="numeric"
                placeholder="Вес (кол-во)"
                maxLength={8}
                // placeholderTextColor={#f68548}
              />
            </View>
            <ViewButton styles={styles.btnAdd} onclick={addInInvoice}>
              Добавить
            </ViewButton>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  parennt: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  leftovers: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(47, 71, 190, 0.591)',
    marginVertical: 5,
  },

  child: {
    padding: 15,
    paddingVertical: 10,
    paddingBottom: 25,
    borderRadius: 5,
    backgroundColor: '#ebeef2',
    position: 'relative',
  },

  title: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 10,
    maxWidth: '85%',
  },

  addDataBlock: {
    width: '95%',
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },

  input: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 40,
    width: '48%',
    borderRadius: 5,
    borderColor: 'rgb(217 223 232)',
    borderRadius: 8,
    backgroundColor: '#fff',
  },

  btnAdd: {
    color: '#fff',
    paddingTop: 11,
    paddingBottom: 11,
    borderRadius: 8,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: 'rgb(217 223 232)',
    fontSize: 18,
    marginTop: 10,
    backgroundColor: 'rgba(97 ,100, 239,0.7)',
  },

  //////////////////// krestik
  krest: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    position: 'absolute',
    right: 0,
    top: 10,
  },

  line: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'red',
  },

  deg: { transform: [{ rotate: '45deg' }] },
  degMinus: { transform: [{ rotate: '-45deg' }] },
});
