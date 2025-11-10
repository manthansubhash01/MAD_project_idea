import React from "react";
import { View, Text } from "react-native";
import { Svg, Circle } from "react-native-svg";

const TaskProgressCircle = ({ total = 10, completed = 4, size = 150, strokeWidth = 25 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total === 0 ? 0 : completed / total;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        <Circle
          stroke="#2E2E2E" 
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        <Circle
          stroke= "#8FB9E1"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <View className="absolute items-center justify-center">
        <Text className="text-jet text-lg font-bold">
          {Math.round(progress * 100)}%
        </Text>
        <Text className="text-gray-500 text-sm">
          {completed}/{total}
        </Text>
      </View>
    </View>
  );
};

export default TaskProgressCircle;
