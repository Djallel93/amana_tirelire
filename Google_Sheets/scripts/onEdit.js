function onEdit(e) {
  // Vérifier si un rollback est en cours
  if (
    PropertiesService.getScriptProperties().getProperty(
      "rollbackInProgress"
    ) === "true"
  ) {
    // Réinitialiser la propriété après rollback
    PropertiesService.getScriptProperties().deleteProperty(
      "rollbackInProgress"
    );
    console.log("une édition est déjà en cours en cours...");
    return; // Sortie de la fonction pour empêcher la réexécution
  }

  const calendar = CalendarApp.getDefaultCalendar();
  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName();
  const editedRow = e.range.getRow();
  const editedColumn = e.range.getColumn();
  const userMail = String(e.user);
  const currentUser = getUserDetailsByMail(userMail);

  if (!currentUser) {
    PropertiesService.getScriptProperties().setProperty(
      "rollbackInProgress",
      "true"
    );
    noRollbackSetValue(e.range, e.oldValue);
    showAlert(
      "Le frère " +
        userMail +
        " n'existe pas dans la liste des frères. Merci de vous renseigner auprès de votre administrateur."
    );
    return;
  }

  console.log("Session user: " + userMail);

  if (
    sheetName !== SHEET_DEF.FRERE.SHEET_NAME &&
    !canEditCells(sheet, editedRow, userMail)
  ) {
    // Annuler la modification si l'utilisateur n'est pas autorisé
    noRollbackSetValue(e.range, e.oldValue);
    return;
  }

  console.log("Le frère actuelle possède le droit de modifier le champs...");

  // Tous les administrateur peuvent modifier n'importe quel responsable
  if (
    sheetName === SHEET_DEF.TIRELIRE.SHEET_NAME &&
    editedColumn === SHEET_DEF.TIRELIRE.COLUMNS.RESPONSABLE.INDEX
  ) {
    if (!canEditResponsable(e, currentUser)) {
      return;
    }
  }

  console.log(
    "Le frère " +
      userMail +
      " possède le droit de modifier le champs responsable..."
  );

  if (sheetName === SHEET_DEF.FRERE.SHEET_NAME && editedRow > 1) {
    updateListeFrere();
  }

  if (
    sheetName === SHEET_DEF.TIRELIRE.SHEET_NAME &&
    editedRow !== sheet.getLastRow()
  ) {
    getTirelire(editedRow, editedColumn, calendar);
  }

  PropertiesService.getScriptProperties().setProperty(
    "rollbackInProgress",
    "false"
  );
}
