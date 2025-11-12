import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";

import testIDs from "../testID.js";
import AgendaItem from "../mocks/AgendaItem";
import { getTheme, themeColor, lightThemeColor } from "../mocks/theme";
import CreateEventModal from "../components/CreateEventModal";
import { API_URL } from "../config/api";
const TOKEN = "authToken";

const leftArrowIcon = require("../img/previous.png");
const rightArrowIcon = require("../img/next.png");
const CHEVRON = require("../img/next.png");

const ExpandableCalendarScreen = ({ weekView }) => {
  const [events, setEvents] = useState([]);
  const [agendaItems, setAgendaItems] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });
  const calendarRef = useRef(null);
  const rotation = useRef(new Animated.Value(0));

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem(TOKEN);

      if (!token) {
        setLoading(false);
        setAgendaItems([]);
        return;
      }

      const response = await fetch(`${API_URL}/user/events`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Response not OK:", response.status);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setEvents(data.events);
        formatEventsForCalendar(data.events);
      } else {
        console.error("Fetch failed:", data.message);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setAgendaItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatEventsForCalendar = useCallback((eventsData) => {
    const groupedByDate = {};
    const marked = {};

    eventsData.forEach((event) => {
      if (!groupedByDate[event.date]) {
        groupedByDate[event.date] = [];
      }
      groupedByDate[event.date].push({
        ...event,
        hour: event.hour,
        duration: event.duration,
        title: event.title,
        description: event.description,
        _id: event._id,
      });

      marked[event.date] = { marked: true, dotColor: themeColor };
    });

    const agendaArray = Object.keys(groupedByDate)
      .sort()
      .map((date) => ({
        title: date,
        data: groupedByDate[date],
      }));

    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + 30);

    for (let d = new Date(today); d <= futureDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split("T")[0];
      if (!groupedByDate[dateString]) {
        agendaArray.push({
          title: dateString,
          data: [{}],
        });
      }
    }

    agendaArray.sort((a, b) => new Date(a.title) - new Date(b.title));

    setAgendaItems(agendaArray);
    setMarkedDates(marked);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateEvent = async (eventData) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN);

      if (!token) {
        Alert.alert("Error", "Please login to create events");
        return;
      }

      const response = await fetch(`${API_URL}/user/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Create event error:", errorText);
        Alert.alert("Error", "Failed to create event. Please try again.");
        return;
      }

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Event created successfully");
        fetchEvents();
      } else {
        Alert.alert("Error", data.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert("Error", "Failed to create event. Check your connection.");
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN);
      const eventId = eventData.id;

      if (!token) {
        Alert.alert("Error", "Please login to update events");
        return;
      }

      const response = await fetch(`${API_URL}/user/events/${eventId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update event error:", errorText);
        Alert.alert("Error", "Failed to update event. Please try again.");
        return;
      }

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Event updated successfully");
        fetchEvents();
      } else {
        Alert.alert("Error", data.message || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      Alert.alert("Error", "Failed to update event");
    }
  };

  const handleDeleteEvent = async (event) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN);
      const eventId = event._id;

      if (!token) {
        Alert.alert("Error", "Please login to delete events");
        return;
      }

      const response = await fetch(`${API_URL}/user/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete event error:", errorText);
        Alert.alert("Error", "Failed to delete event. Please try again.");
        return;
      }

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Event deleted successfully");
        fetchEvents();
      } else {
        Alert.alert("Error", data.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      Alert.alert("Error", "Failed to delete event");
    }
  };

  const handleSaveEvent = (eventData) => {
    if (selectedEvent) {
      handleUpdateEvent(eventData);
    } else {
      handleCreateEvent(eventData);
    }
    setSelectedEvent(null);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const renderItem = useCallback(({ item }) => {
    return (
      <AgendaItem
        item={item}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    );
  }, []);

  const toggleCalendarExpansion = useCallback(() => {
    const isOpen = calendarRef.current?.toggleCalendarPosition();
    Animated.timing(rotation.current, {
      toValue: isOpen ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, []);

  const renderHeader = useCallback(
    (date) => {
      const rotationInDegrees = rotation.current.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "-180deg"],
      });

      return (
        <TouchableOpacity
          style={styles.header}
          onPress={toggleCalendarExpansion}
        >
          <Text style={styles.headerTitle}>{date?.toString("MMMM yyyy")}</Text>
          <Animated.Image
            source={CHEVRON}
            style={{
              transform: [{ rotate: "90deg" }, { rotate: rotationInDegrees }],
            }}
          />
        </TouchableOpacity>
      );
    },
    [toggleCalendarExpansion]
  );

  const onCalendarToggled = useCallback((isOpen) => {
    rotation.current.setValue(isOpen ? 1 : 0);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themeColor} />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CalendarProvider
        date={agendaItems[0]?.title || new Date().toISOString().split("T")[0]}
        showTodayButton
        theme={todayBtnTheme.current}
      >
        {weekView ? (
          <WeekCalendar
            testID={testIDs.weekCalendar.CONTAINER}
            firstDay={1}
            markedDates={markedDates}
          />
        ) : (
          <ExpandableCalendar
            testID={testIDs.expandableCalendar.CONTAINER}
            renderHeader={renderHeader}
            ref={calendarRef}
            onCalendarToggled={onCalendarToggled}
            theme={theme.current}
            firstDay={1}
            markedDates={markedDates}
            leftArrowImageSource={leftArrowIcon}
            rightArrowImageSource={rightArrowIcon}
          />
        )}

        <AgendaList
          sections={agendaItems}
          renderItem={renderItem}
          sectionStyle={styles.section}
        />
      </CalendarProvider>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setSelectedEvent(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <CreateEventModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        initialEvent={selectedEvent}
      />
    </View>
  );
};

export default ExpandableCalendarScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: "bold", marginRight: 6 },
  section: {
    backgroundColor: lightThemeColor,
    color: "grey",
    textTransform: "capitalize",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#7284BE",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabIcon: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
});
