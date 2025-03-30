function scheduleEvents() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Event Scheduler");
  if (!sheet) {
    Logger.log("❌ Error: Sheet 'Event Scheduler' not found.");
    return;
  }

  var calendar = CalendarApp.getDefaultCalendar(); // Use primary Google Calendar
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var title = data[i][0], date = data[i][1], startTime = data[i][2], endTime = data[i][3], attendees = data[i][4], status = data[i][5];

    if (status === "Scheduled") continue; // Skip already scheduled events

    try {
      var eventStart = new Date(date + " " + startTime);
      var eventEnd = new Date(date + " " + endTime);

      if (eventStart < new Date()) {
        throw new Error("Cannot schedule events in the past.");
      }

      var event = calendar.createEvent(title, eventStart, eventEnd, {
        guests: attendees.replace(/\s/g, ""), // Remove spaces from emails
        sendInvites: true
      });

      event.addPopupReminder(10); // 10-minute reminder
      event.addEmailReminder(30); // 30-minute email reminder
      sheet.getRange(i + 1, 6).setValue("Scheduled ✅");

    } catch (error) {
      sheet.getRange(i + 1, 6).setValue("Failed ❌: " + error.message);
    }
  }
}