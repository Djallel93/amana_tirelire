function onEdit (e) {
  // Vérifier si un rollback est en cours
  console.log(
    'rollbackInProgress : ' +
      PropertiesService.getScriptProperties().getProperty('rollbackInProgress')
  )
  if (
    PropertiesService.getScriptProperties().getProperty(
      'rollbackInProgress'
    ) === 'true'
  ) {
    // Réinitialiser la propriété après rollback
    PropertiesService.getScriptProperties().deleteProperty(
      'rollbackInProgress'
    )
    console.log('une édition est déjà en cours en cours...')
    return // Sortie de la fonction pour empêcher la réexécution
  }

  const calendar = CalendarApp.getDefaultCalendar()
  const sheet = e.source.getActiveSheet()
  const currentUser = getUserDetailsByMail(
    e.user,
    SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName(FRERE_DEF.SHEET_NAME)
      .getDataRange()
      .getValues()
  )

  if (!currentUser) {
    PropertiesService.getScriptProperties().setProperty(
      'rollbackInProgress',
      'true'
    )
    noRollbackSetValue(e.range, e.oldValue)
    showAlert(
      'Le frère ' +
        e.user +
        ' n\'existe pas dans la liste des frères. Merci de vous renseigner auprès de votre administrateur.'
    )
    return
  }

  console.log('Session user: ' + e.user)
  console.log(
    'La cellule ' +
      e.range.getColumn() +
      ':' +
      e.range.getRow() +
      ' de la page ' +
      sheet.getName() +
      ' est en cours d\'édition...'
  )

  if (!canEditCells(e, currentUser)) {
    return // Exit if the user is not allowed to edit
  }

  if (sheet.getName() === FRERE_DEF.SHEET_NAME && e.range.getRow() > 1) {
    var editedRow = e.range.getRow()
    var editedColumn = e.range.getColumn()
    updateListeFrere(sheet, editedRow, editedColumn)
  }

  if (sheet.getName() == TIRELIRE_DEF.SHEET_NAME && e.range.getRow() > 1) {
    var editedRow = e.range.getRow()
    var editedColumn = e.range.getColumn()

    getTirelire(sheet, editedRow, editedColumn, calendar)
  }
}
