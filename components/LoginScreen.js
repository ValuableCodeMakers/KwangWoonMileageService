import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import * as firebase from 'firebase';
import Animated, {Easing} from 'react-native-reanimated';
import {
  TapGestureHandler,
  State,
  TouchableOpacity,
} from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('window');
const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
  concat,
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position,
  ]);
}

class LoginScreen extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor() {
    super();

    this.buttonOpacity = new Value(1); // 초기 값
    this.onStateChange = event([
      {
        nativeEvent: ({state}) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0)),
            ),
          ]),
      },
    ]);

    this.onCloseState = event([
      {
        nativeEvent: ({state}) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 0, 1)),
            ),
          ]),
      },
    ]);

    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.backGroundY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 2.5, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.textInputZindex = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, -1],
      extrapolate: Extrapolate.CLAMP,
    });

    this.textInputY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [0, 100],
      extrapolate: Extrapolate.CLAMP,
    });

    this.textInputOpacity = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.rotateCross = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [180, 360],
      extrapolate: Extrapolate.CLAMP,
    });
  }

  state = {
    email: '',
    password: '',
    errorMessage: null,
  };

  handleLogin = () => {
    const {email, password} = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => this.setState({errorMessage: err.message}));
  };

  render() {
    return (
      // <View style={styles.container}>
      //   <StatusBar barStyle="light-content"></StatusBar>
      //   <Text style={styles.greeting}>{`로그인하고 시작해보세요`}</Text>

      //   <View style={styles.errorMessage}>
      //     {this.state.errorMessage && (
      //       <Text style={styles.error}>{this.state.errorMessage}</Text>
      //     )}
      //   </View>


      <View
        style={{flex: 1, backgroundColor: 'white', justifyContent: 'flex-end'}}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            transform: [{translateY: this.backGroundY}],
          }}>
          <Image
            source={require('../src/login.png')}
            style={{flex: 1, height: null, width: null, zIndex: -1}}></Image>
        </Animated.View>

        <View style={{height: height / 2.5, justifyContent: 'center'}}>
          <TapGestureHandler onHandlerStateChange={this.onStateChange}>
            <Animated.View
              style={{
                ...styles.button,
                opacity: this.buttonOpacity,
                transform: [{translateY: this.buttonY}],
              }}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>로그인</Text>
            </Animated.View>
          </TapGestureHandler>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Register')}>
            <Animated.View
              style={{
                ...styles.button,
                opacity: this.buttonOpacity,
                transform: [{translateY: this.buttonY}],
              }}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>회원가입</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* 로그인 화면 */}
          <Animated.View
            style={{
              zIndex: this.textInputZindex,
              opacity: this.textInputOpacity,
              transform: [{translateY: this.textInputY}],
              height: height / 2.5,
              ...StyleSheet.absoluteFill,
              top: null,
              justifyContent: 'center',
            }}>
            <TapGestureHandler onHandlerStateChange={this.onCloseState}>
              <Animated.View style={styles.closeButton}>
                <Animated.Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    transform: [{rotate: concat(this.rotateCross, 'deg')}],
                  }}>
                  X
                </Animated.Text>
              </Animated.View>
            </TapGestureHandler>

            <TextInput
              style={styles.textInput}
              placeholder="EMAIL"
              autoCapitalize="none"
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}></TextInput>

            <TextInput
              style={styles.textInput}
              placeholder="PASSWORD"
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}></TextInput>

            <TouchableOpacity opacity={0.1} onPress={this.handleLogin}>
              <Animated.View style={{...styles.button, marginTop: 10}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>로그인</Text>
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorMessage: {
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  error: {
    color: '#c0392b',
    fontSize: 15,
    textAlign: 'center',
  },
  inputTitle: {
    color: '#7f8c8d',
    fontSize: 15,
    textTransform: 'uppercase',
  },

  closeButton: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -20,
    left: width / 2 - 20,
    elevation: 30,
  },
  button: {
    marginHorizontal: 25,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 35,
    height: 70,
    elevation: 10,
  },
  textInput: {
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    marginHorizontal: 25,
    paddingLeft: 10,
    marginVertical: 5,
    borderColor: '#bdc3c7',
  },
});

export default LoginScreen;
