function transferResponsable(calendar, id_event, newFrere, newDeadline) {
  const tirelireData = getSheetDataByName(SHEET_DEF.TIRELIRE.SHEET_NAME);
  const sheet = getSheetByName(SHEET_DEF.TIRELIRE.SHEET_NAME);
  console.log("Recherche de l'événement " + id_event);

  const eventIndex = getColumnIndex("TIRELIRE", "ID_EVENT");
  const responsableIndex = getRealColumnIndex("TIRELIRE", "RESPONSABLE");
  const targetRow = tirelireData.find((row) => row[eventIndex] === id_event);

  if (targetRow) {
    const rowIndex = tirelireData.indexOf(targetRow) + 2;
    console.log("Événement trouvé. Changement du responsable");

    noRollbackSetValue(sheet.getRange(rowIndex, responsableIndex), newFrere);
    reScheduleEvent(rowIndex, calendar, id_event, newDeadline);
  } else {
    console.error("Événement non trouvé avec l'ID " + id_event);
  }
}
