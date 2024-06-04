function findAndReScheduleEvent (sheet, tirelireData, calendar, id_event, newDeadline) {
  console.log('Recherche de l\'événement ' + id_event)

  for (let i = 1; i < tirelireData.length; i++) {
    if (tirelireData[i][TIRELIRE_DEF.ID_EVENT - 1] === id_event) {
      reScheduleEvent(sheet, i + 1, calendar, id_event, newDeadline)
      break
    }
  }
}

function reScheduleEvent (sheet, row, calendar, id_event, newDeadline) {
  console.log('Suppression de l\'événement ' + id_event)
  const event = CalendarApp.getEventById(id_event)
  event.deleteEvent()
  sheet.getRange(row, TIRELIRE_DEF.ID_EVENT).setValue('')

  console.log('Création du nouvel événement sur le calendrier')

  const newEvent = createCalendarEvent(sheet, row, calendar, newDeadline)
  console.log(
    'Événement crée avec succès à la date du ' +
      newDeadline +
      '. Mise à jour de la nouvelle ligne...'
  )
  noRollbackSetValue(
    sheet.getRange(row, TIRELIRE_DEF.ID_EVENT),
    newEvent.getId()
  )
}
