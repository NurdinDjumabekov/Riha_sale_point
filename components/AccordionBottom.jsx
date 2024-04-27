import React, { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import BottomSheet, {
  BottomSheetView,
  TouchableHighlight,
} from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

// const [isOpen, setIsOpen] = useState(true);

export const AccordionBottom = (props) => {
  const { start, arrHeight, setIsOpen, isOpen, children } = props;

  const sheetRef = useRef(null);

  const snapPoints = ["30%", "50%", "100%"];
  const openModal = useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.snapToIndex(1 || 0);
      // setIsOpen(true);
      // console.log("useCallback");
    }
  }, []);

  console.log(isOpen);

  useEffect(() => {
    if (isOpen) {
      openModal();
    }
  }, [isOpen]);

  // console.log(sheetRef, "sheetRef");

  const isClose = () => {
    setIsOpen(false);
  };

  return (
    <View
      style={[styles.container, !isOpen && styles.emptycontainer]}
      onPress={isClose}
    >
      <BottomSheet
        ref={sheetRef}
        snapPoints={arrHeight}
        enablePanDownToClose={true}
        onClose={() => isClose()}
      >
        <BottomSheetView>{children}</BottomSheetView>
      </BottomSheet>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 99,
    minWidth: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.352)",
    height: "100%",
  },

  emptycontainer: {
    height: 0,
  },

  btnOpen: {
    backgroundColor: "green",
  },
});
