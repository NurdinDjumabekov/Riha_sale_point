import { Text } from "react-native";
import React from "react";
import { formatCount, unitResultFN } from "../../helpers/amounts";

////style
import styles from "./style";

const ResultCounts = ({ list }) => {
  const totals = unitResultFN(list);

  const twoResult = !!+totals?.totalKg && !!+totals?.totalSht;

  return (
    <>
      {(!!+totals?.totalKg || !!+totals?.totalSht) && (
        <Text style={styles.totalItemCount}>
          Итого: {!!+totals?.totalKg && `${formatCount(totals?.totalKg)} кг`}
          {twoResult && " и "}
          {!!+totals?.totalSht && `${formatCount(totals?.totalSht)} штук`}
        </Text>
      )}
    </>
  );
};

export default ResultCounts;
