///// tags
import { FlatList, Text, View } from "react-native";

////// helpers
import { objTitleLeftov } from "../../../helpers/Data";
import { formatCount } from "../../../helpers/amounts";

///// style
import styles from "./style";

export const TablesLeftovers = ({ arr }) => {
  return (
    <View style={styles.parentFlatList}>
      <View style={[styles.mainBlock, styles.more]}>
        <Text style={[styles.name, styles.moreText]}>
          {objTitleLeftov?.[1]}
        </Text>
        <Text style={[styles.price, styles.moreText]}>
          {objTitleLeftov?.[2]}
        </Text>
        <Text style={[styles.ostatokStart, styles.moreText]}>
          {objTitleLeftov?.[3]}
        </Text>
        <Text style={[styles.prihod, styles.moreText]}>
          {objTitleLeftov?.[4]}
        </Text>
        <Text style={[styles.rashod, styles.moreText]}>
          {objTitleLeftov?.[5]}
        </Text>
        <Text style={[styles.ostatokEnd, styles.moreText]}>
          {objTitleLeftov?.[6]}
        </Text>
      </View>
      <FlatList
        data={arr}
        renderItem={({ item, index }) => (
          <View style={styles.mainBlock}>
            <Text style={styles.name}>
              {index + 1}. {item?.product_name}
            </Text>
            <Text style={styles.price}>{formatCount(item?.price)}</Text>
            <Text style={styles.ostatokStart}>
              {formatCount(item?.start_outcome)}
            </Text>
            <Text style={styles.prihod}>{formatCount(item?.income)}</Text>
            <Text style={styles.rashod}>{formatCount(item?.outcome)}</Text>
            <Text style={styles.ostatokEnd}>
              {formatCount(item?.end_outcome)}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => `${item.guid}${index}`}
        nestedScrollEnabled
      />
    </View>
  );
};
