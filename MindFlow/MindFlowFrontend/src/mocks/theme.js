import {Platform} from 'react-native';

export const themeColor = '#71A5E9';
export const lightThemeColor = '#DAF0F7';

export function getTheme() {
  const disabledColor = 'grey';

  return {
    arrowColor: 'black',
    arrowStyle: {padding: 0},

    expandableKnobColor: themeColor,

    monthTextColor: 'black',
    textMonthFontSize: 16,
    textMonthFontFamily: 'HelveticaNeue',
    textMonthFontWeight: 'bold',

    textSectionTitleColor: 'black',
    textDayHeaderFontSize: 12,
    textDayHeaderFontFamily: 'HelveticaNeue',
    textDayHeaderFontWeight: 'normal',

    dayTextColor: themeColor,
    todayTextColor: '#f04a00ff',
    textDayFontSize: 18,
    textDayFontFamily: 'HelveticaNeue',
    textDayFontWeight: '500',
    textDayStyle: {marginTop: Platform.OS === 'android' ? 2 : 4},

    selectedDayBackgroundColor: themeColor,
    selectedDayTextColor: 'white',

    textDisabledColor: disabledColor,

    dotColor: themeColor,
    selectedDotColor: 'white',
    disabledDotColor: disabledColor,
    dotStyle: {marginTop: -2}
  };
}
