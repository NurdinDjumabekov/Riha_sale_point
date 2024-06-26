/////// tags
import { Text, TouchableOpacity, View } from "react-native";

////// hooks
import { useDispatch } from "react-redux";

///// fns
import { changeTemporaryData } from "../../../store/reducers/stateSlice";

///// style
import styles from "./style";

export const EveryProduct = (props) => {
  //// SalePointScreen - для продажи
  const { obj, index, navigation, type } = props;

  const dispatch = useDispatch();

  const addInTemporary = () => {
    if (type == "sale") {
      navigation.navigate("EverySaleProdScreen", { obj });
    } else if (type == "soputka") {
      dispatch(changeTemporaryData(obj));
    }
  };

  return (
    <TouchableOpacity onPress={addInTemporary} style={styles.blockMain}>
      <View style={styles.blockMainInner}>
        <View>
          <View style={styles.mainContent}>
            <Text style={styles.title}>{index + 1}. </Text>
            <Text style={[styles.title, styles.width85]}>
              {obj?.product_name}
            </Text>
          </View>
        </View>
        <View style={styles.arrow}></View>
      </View>
    </TouchableOpacity>
  );
};
