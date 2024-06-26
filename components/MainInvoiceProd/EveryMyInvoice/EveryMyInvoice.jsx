//// tags
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

//// hooks
import { useDispatch } from "react-redux";
import { formatCount } from "../../../helpers/amounts";

/////fns
import { clearAcceptInvoiceTT } from "../../../store/reducers/stateSlice";
import { changePreloader } from "../../../store/reducers/requestSlice";

/////helpers
import { useRoute } from "@react-navigation/native";

////style
import styles from "./style";

export const EveryMyInvoice = (props) => {
  //// для принятия накладных и возврата товара

  //// status - 0(накладные только для просмотра),
  //// 1(не принятые накладные),
  //// 2(принятые накладные)

  const route = useRoute();
  const dispatch = useDispatch();

  /////////////////////////////////////////////////
  const location = route.name; ///// MyReturnsScreen и AcceptInvoiceProdScreen
  const check = location == "MyReturnsScreen";
  /////////////////////////////////////////////////

  const { obj, navigation, screns } = props;

  const objType = {
    0: { text: "На складе", color: "red" },
    1: { text: "Отгружено", color: "red" },
    2: { text: "Принято", color: "green" },
  };

  const objTypeReturn = {
    1: { text: "Ожидание", color: "red" },
    2: { text: "Принято", color: "green" },
  };

  const statusInfo = objType?.[obj?.status] || {
    text: "Отклонено",
    color: "red",
  };

  const statusReturns = objTypeReturn?.[obj?.status] || {
    text: "Отклонено",
    color: "red",
  };

  const checkStyle = check ? statusReturns : statusInfo;

  const lookInvoice = () => {
    const { date, guid, status, codeid } = obj;
    if (check) {
      if (status == 1) {
        /// if накладная отгружена для ТА
        const dataSend = { date, guid, status };
        navigation.navigate(screns?.[0], dataSend);
        dispatch(clearAcceptInvoiceTT()); //// очиющаю guid накладной
        dispatch(changePreloader(true)); /// чтобы вначале не показывался пустой массив
      } else if (status == 2 || status == -2) {
        /// if накладная уже принята
        const dataSend = { codeid, guid };
        navigation.navigate(screns?.[1], dataSend);
      }
    } else {
      if (+status === 1 || +status === 0) {
        /// if накладная отгружена для ТА
        const dataSend = { date, guid, status };
        navigation.navigate(screns?.[0], dataSend);
        dispatch(clearAcceptInvoiceTT()); //// очиющаю guid накладной
        dispatch(changePreloader(true)); /// чтобы вначале не показывался пустой массив
      } else if (status == 2 || status == -2) {
        /// if накладная уже принята
        const dataSend = { codeid, guid };
        navigation.navigate(screns?.[1], dataSend);
      }
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={lookInvoice}>
      <View style={styles.innerBlock}>
        <View style={styles.mainData}>
          <Text style={styles.titleNum}>{obj.codeid}</Text>
          <View>
            <Text
              style={[styles.titleDate, styles.role]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {obj?.agent}
            </Text>
            <Text style={styles.titleDate}>{obj.date}</Text>
          </View>
        </View>
        {!!obj?.comment ? (
          <Text style={styles.comments} numberOfLines={4} ellipsizeMode="tail">
            {obj.comment}
          </Text>
        ) : (
          <Text style={styles.comments}> ...</Text>
        )}
      </View>
      <View style={styles.mainDataArrow}>
        <View>
          <Text style={{ color: checkStyle?.color }}>{checkStyle?.text}</Text>
          <Text style={styles.totalPrice}>
            {formatCount(obj?.total_price)} сом
          </Text>
        </View>
        <View style={styles.arrow}></View>
      </View>
    </TouchableOpacity>
  );
};
