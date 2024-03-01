import {DeepPartial, Theme} from 'stream-chat-react-native';
import { verticalScale } from '../utils/scalingUnits';

export const chatTheme: DeepPartial<Theme> = {
  messageSimple: {
    content: {
      containerInner: {
        borderColor: '#E8EAF3',
      },
      textContainer: {
        backgroundColor: '#fff',
        borderColor: '#fff',
        borderWidth: 0,
      },
    },
  },
  colors: {
    black: '#262933',
  },
  messageList: {
    contentContainer: {
      backgroundColor: 'transparent',
    },
    container: {
      backgroundColor: 'transparent',
    },
  },
  messageInput: {
    container: {
      backgroundColor: 'transparent',
    },
    inputBoxContainer: {
      backgroundColor: '#EFF2F4',
      minHeight: verticalScale(48),
      borderRadius: verticalScale(27),
      borderWidth: 0,
    },
    inputBox: {
      fontFamily: 'Mulish-Regular',
    },
  },
};