function transferResponsable(
  sheet,
  tirelireData,
  calendar,
  id_event,
  newFrere,
  newDeadline
) {
  console.log("Recherche de l'événement " + id_event);
  for (let i = 1; i < tirelireData.length; i++) {
    if (tirelireData[i][TIRELIRE_DEF.ID_EVENT.INDEX - 1] === id_event) {
      console.log("Événement trouvé. Changement du responsable");

      noRollbackSetValue(
        sheet.getRange(i + 1, TIRELIRE_DEF.RESPONSABLE.INDEX),
        newFrere,
        TIRELIRE_DEF.RESPONSABLE.TYPE
      );

      reScheduleEvent(sheet, i + 1, calendar, id_event, newDeadline);
    }
  }
}
