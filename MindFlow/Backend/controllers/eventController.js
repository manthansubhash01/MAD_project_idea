const Event = require("../models/Event");

exports.getEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Event.find({ userId }).sort({ date: 1, hour: 1 });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

exports.getEventsByDateRange = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const query = { userId };

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const events = await Event.find(query).sort({ date: 1, hour: 1 });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Error fetching events by date range:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findOne({ _id: eventId, userId });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, hour, duration } = req.body;
    const userId = req.user.id;

    if (!title || !date || !hour) {
      return res.status(400).json({
        success: false,
        message: "Title, date, and hour are required",
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      hour,
      duration: duration || "1h",
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    const { title, description, date, hour, duration } = req.body;

    const event = await Event.findOne({ _id: eventId, userId });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (hour !== undefined) event.hour = hour;
    if (duration !== undefined) event.duration = duration;

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findOneAndDelete({ _id: eventId, userId });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};
