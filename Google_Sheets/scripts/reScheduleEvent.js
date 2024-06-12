function findAndReScheduleEvent(calendar, id_event, newDeadline) {
  const tirelireData = getSheetDataByName(SHEET_DEF.TIRELIRE.SHEET_NAME);
  
  console.log("Recherche de l'événement " + id_event);
  const eventIndex = getColumnIndex("TIRELIRE", "ID_EVENT");
  const targetRow = tirelireData.find((row) => row[eventIndex] === id_event);

  if (targetRow) {
    const rowIndex = tirelireData.indexOf(targetRow) + 2;
    reScheduleEvent(rowIndex, calendar, id_event, newDeadline);
  } else {
    console.error("Événement non trouvé avec l'ID " + id_event);
  }
}

function reScheduleEvent(row, calendar, id_event, newDeadline) {
  const sheet = getSheetByName(SHEET_DEF.TIRELIRE.SHEET_NAME);

  console.log("Suppression de l'événement " + id_event);
  const event = CalendarApp.getEventById(id_event);
  event.deleteEvent();
  sheet.getRange(row, getRealColumnIndex("TIRELIRE", "ID_EVENT")).setValue("");

  console.log("Création du nouvel événement sur le calendrier");

  const newEvent = createCalendarEvent(sheet, row, calendar, newDeadline);
  console.log(
    "Événement crée avec succès à la date du " +
      newDeadline +
      ". Mise à jour de la nouvelle ligne..."
  );
  noRollbackSetValue(
    sheet.getRange(row, getRealColumnIndex("TIRELIRE", "ID_EVENT")),
    newEvent.getId()
  );
}
