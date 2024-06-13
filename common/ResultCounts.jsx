import { Text, StyleSheet } from "react-native";
import React from "react";
import { formatCount, unitResultFN } from "../helpers/amounts";

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

const styles = StyleSheet.create({
  totalItemCount: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgba(47, 71, 190, 0.991)",
    paddingHorizontal: 10,
  },
});
