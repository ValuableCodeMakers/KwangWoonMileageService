import React, { Component, useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { width, height } from '../../../Modules/Dimensions.js'

import QRCodeScanner from 'react-native-qrcode-scanner';

const QRcodeScreen = (props) => {
  const scanner = React.useRef('');

  const onSuccess = (e) => {
    console.log(e);

    props.navigation.goBack();
    props.navigation.state.params.handleState({ toAddress: e.data });
  };

  return (
    <QRCodeScanner
      reactivate={true}
      showMarker={true}
      ref={(node) => {
        scanner.current = node;
      }}
      onRead={onSuccess}
      cameraStyle={{ height: height * 0.8 }}
      topContent={
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: height * 0.1,
            width: width,
            backgroundColor: '#c0392b',
          }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
            QR코드를 찍으세요!
          </Text>
        </View>
      }
      bottomContent={
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: height * 0.1,
            width: width,
            backgroundColor: '#c0392b',
          }}>

          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
              스캔 중지 🙅‍♂️
            </Text>
          </TouchableOpacity>
        </View>
      }></QRCodeScanner>
  );
};

QRcodeScreen.navigationOptions = () => ({
  headerShown: false,
});

export default QRcodeScreen;
