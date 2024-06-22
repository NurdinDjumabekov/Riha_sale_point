import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import styles from "./style";
import qrCode from "../../assets/icons/qr_code.png";

const BtnScaner = ({ navigation }) => {
  const nav = () => navigation.navigate("ScannerSaleScreen");

  return (
    <TouchableOpacity style={styles.blockBtn} onPress={nav}>
      <Image style={styles.qrCodeImg} source={qrCode} />
    </TouchableOpacity>
  );
};

export default BtnScaner;
