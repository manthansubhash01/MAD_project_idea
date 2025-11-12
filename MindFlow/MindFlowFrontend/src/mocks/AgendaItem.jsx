import isEmpty from "lodash/isEmpty";
import React, { useCallback } from "react";
import {
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
  Button,
} from "react-native";
import testIDs from "../testID.js";

const AgendaItem = ({ item, onEdit, onDelete }) => {
  const buttonPressed = useCallback(() => {
    Alert.alert(item.title, item.description || "No description", [
      {
        text: "Edit",
        onPress: () => onEdit && onEdit(item),
      },
      {
        text: "Delete",
        onPress: () => {
          Alert.alert(
            "Delete Event",
            "Are you sure you want to delete this event?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => onDelete && onDelete(item),
              },
            ]
          );
        },
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  }, [item, onEdit, onDelete]);

  const itemPressed = useCallback(() => {
    buttonPressed();
  }, [buttonPressed]);

  if (isEmpty(item)) {
    return (
      <View style={styles.emptyItem}>
        <Text style={styles.emptyItemText}>No Events Planned Today</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={itemPressed}
      style={styles.item}
      testID={testIDs.agenda.ITEM}
    >
      <View>
        <Text style={styles.itemHourText}>{item.hour}</Text>
        <Text style={styles.itemDurationText}>{item.duration}</Text>
      </View>

      <Text style={styles.itemTitleText}>{item.title}</Text>

      <View style={styles.itemButtonContainer}>
        <Button color="#6366f1" title="Options" onPress={buttonPressed} />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(AgendaItem);

const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    flexDirection: "row",
  },
  itemHourText: {
    color: "black",
  },
  itemDurationText: {
    color: "grey",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: "black",
    marginLeft: 16,
    fontWeight: "bold",
    fontSize: 16,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  emptyItemText: {
    color: "lightgrey",
    fontSize: 14,
  },
});
