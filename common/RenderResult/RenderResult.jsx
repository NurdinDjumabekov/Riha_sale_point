import { Text, View } from "react-native";
import { formatCount } from "../../helpers/amounts";

////style
import styles from "./style";

export const RenderResult = ({ item, index }) => {
  const count = +item?.count_usushka || +item?.count;

  return (
    <View style={styles.everyProd}>
      <Text style={styles.titleHistory}>{index + 1}. </Text>
      <View style={styles.mainData}>
        <Text style={styles.titleHistory}>{item.product_name}</Text>
        <View style={styles.everyProdInner}>
          <Text style={styles.koll}>
            {item?.sale_price} х {count} ={" "}
            {formatCount(+item?.sale_price * count)} сом
          </Text>
        </View>
      </View>
    </View>
  );
};
