import { Text, TouchableOpacity, View } from "react-native";
import { statusColor, statusRevision } from "../../../helpers/Data";

////style
import styles from "./style";

export const ListProdsRevision = ({ item, navigation, disable }) => {
  const lookInvoice = (invoice_guid) => {
    const data = { invoice_guid, disable };

    navigation.navigate("EveryRevisionRequestScreen", data);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => lookInvoice(item?.guid)}
    >
      <View style={styles.innerBlock}>
        <Text style={styles.titleDate}>{item?.date}</Text>
        <View style={styles.mainData}>
          <Text style={styles.titleNum}>{item?.codeid} </Text>
          <View>
            <Text style={[styles.titleDate, styles.role]}>
              {item?.seller_from}
            </Text>
            <Text
              style={[styles.titleDate, { color: statusColor?.[item?.status] }]}
            >
              {statusRevision?.[item.status]}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.arrow}></View>
    </TouchableOpacity>
  );
};
