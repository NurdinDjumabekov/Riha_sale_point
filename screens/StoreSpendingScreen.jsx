import { StyleSheet, View, TextInput, Text } from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeExpense } from "../store/reducers/stateSlice";
import {
  addExpenseTT,
  getExpense,
  getSelectExpense,
} from "../store/reducers/requestSlice";
import RNPickerSelect from "react-native-picker-select";
import { ViewButton } from "../customsTags/ViewButton";
import { ListExpense } from "../components/ListExpense";
import { Alert } from "react-native";

export const StoreSpendingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  //   console.log(navigation, "navigation");

  const seller_guid = "e7458a29-6f7f-4364-a96d-ed878812f0cf";

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await dispatch(getSelectExpense()); ///  список селекта расходов ТТ(их траты)
    await dispatch(getExpense(seller_guid)); /// список расходов ТТ(их траты)
  };

  const { expense } = useSelector((state) => state.stateSlice);
  const { listCategExpense } = useSelector((state) => state.requestSlice);

  const addExpense = () => {
    if (expense.amount === "" || expense.amount == "0") {
      Alert.alert("Заполните сумму");
    } else {
      if (expense.expense_type == null || expense.expense_type == "") {
        Alert.alert("Выберите категорию!");
      } else {
        const data = { ...expense, seller_guid };
        dispatch(addExpenseTT({ data, getData }));
      }
    }
  };

  const changeSel = (value) => {
    dispatch(
      changeExpense({
        ...expense,
        expense_type: value,
      })
    );
  };

  const changeAmount = (num) => {
    if (/^\d*\.?\d*$/.test(num) || num === "") {
      dispatch(
        changeExpense({
          ...expense,
          amount: num,
        })
      );
    }
  };

  // console.log(expense, "expense");
  // console.log(listCategExpense, "listCategExpense");
  return (
    <View style={styles.parentBlock}>
      <View style={styles.inputBlock}>
        <View style={styles.selectBlock}>
          <RNPickerSelect
            onValueChange={(value) => changeSel(value)}
            items={listCategExpense}
            placeholder={{ label: "Выберите категорию", value: null }}
            value={expense?.expense_type}
            useNativeAndroidPickerStyle={false}
            style={{
              inputAndroid: styles.select,
              inputIOS: styles.select,
            }}
          />
          <View style={styles.arrow}></View>
        </View>
        <TextInput
          style={styles.input}
          value={expense.amount}
          onChangeText={changeAmount}
          keyboardType="numeric"
          placeholder="Сумма"
          maxLength={7}
        />
        <ViewButton onclick={addExpense} styles={styles.addBtn}>
          +
        </ViewButton>
      </View>
      <View style={styles.inputBlock}>
        <TextInput
          style={[styles.input, styles.width100]}
          value={expense.comment}
          onChangeText={(text) =>
            dispatch(changeExpense({ ...expense, comment: text }))
          }
          placeholder="Комментарий"
        />
      </View>
      <Text style={styles.mainTitle}>Расходы</Text>
      <ListExpense getData={getData} />
    </View>
  );
};

const styles = StyleSheet.create({
  parentBlock: {
    flex: 1,
    backgroundColor: "#ebeef2",
    padding: 10,
  },
  selectBlock: {
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
    borderRadius: 5,
    position: "relative",
    width: "55%",
  },

  select: {
    backgroundColor: "#f5f5f5",
    height: 45,
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
  },

  arrow: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "rgba(162, 178, 238, 0.439)",
    height: 12,
    width: 12,
    borderRadius: 2,
    marginRight: 20,
    position: "absolute",
    right: 5,
    top: 13,
    transform: [{ rotate: "135deg" }],
  },

  inputBlock: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  input: {
    backgroundColor: "#f5f5f5",
    height: 45,
    borderWidth: 1,
    borderColor: "rgba(47, 71, 190, 0.287)",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    width: "20%",
    // color: "rgba(47, 71, 190, 0.591)",
    // fontWeight: "500",
  },
  width100: {
    width: "100%",
  },

  addBtn: {
    minWidth: "19%",
    fontSize: 26,
    lineHeight: 30,
    paddingBottom: 6,
    paddingTop: 8,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: "rgba(12, 169, 70, 0.9)",
    color: "#fff",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "600",
    paddingVertical: 15,
  },
});
