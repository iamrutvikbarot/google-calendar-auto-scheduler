# 📅 Google Calendar Auto-Scheduler  

## 🚀 Overview  
This script automates the creation of events in Google Calendar using data from Google Sheets. It schedules meetings, sends email invites, and includes reminders for attendees.  

## 🔹 Features  
✅ **Automated Event Scheduling** – Creates Google Calendar events from Google Sheets  
✅ **Email Invitations** – Sends invites to all attendees automatically  
✅ **Reminders** – Sets pop-up and email reminders for upcoming events  
✅ **Error Handling** – Logs issues like invalid emails or past dates  

---

## 📑 Google Sheets Format  

Create a **Google Sheet** named **"Event Scheduler"**, structured as follows:  

| Event Title  | Date       | Start Time | End Time | Attendees               | Status  |
|-------------|-----------|-----------|---------|------------------------|---------|
| Team Meeting | 2025-04-01 | 10:00 AM  | 11:00 AM | john@example.com, alice@example.com | Pending |
| Project Demo | 2025-04-02 | 2:00 PM   | 3:00 PM  | bob@example.com          | Pending |

---

## 📅 How to Set Up the Script

1. Create a Google Sheet.
2. Open Google Sheets and create a sheet named “Event Scheduler” with the columns above.
3. Open Apps Script Editor (Extensions → Apps Script).
4. Copy and paste the scheduleEvent.gs script.
5. Click Run → Select scheduleEvents.
6. Authorize the script when prompted.
7. Check Google Calendar to see scheduled events. 

## 📜 Script Code (`scheduleEvent.gs`)  

```javascript
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
