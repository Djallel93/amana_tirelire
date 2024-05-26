function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var editedRow = range.getRow();
  var editedColumn = range.getColumn();
  var skipCheck = false;
  var skipTrigger = false;
  
  console.log("Session user: " + e.user);
  console.log("La cellule " + range.getColumn() + ":" + range.getRow() + " de la page " + sheet.getName() + " est en cours d'edition...");
  
  if (sheet.getName() == 'tirelire') {
    var editablesColumns = sheet.getRange(editedRow, tirelireColumns.magasin, 1, tirelireColumns.perdu);

    console.log("editedColumn : " + editedColumn);
    console.log("responsable : " + tirelireColumns.responsable);
    // Check if user has rights to edit
    if (editedColumn === tirelireColumns.responsable) {
      if (!canEditResponsable(skipCheck, e, range, editablesColumns)) {
        return; // Exit if the user is not allowed to edit
      }
    }

    if (!canEditCells(skipCheck, e, sheet, editedRow)) {
      return; // Exit if the user is not allowed to edit
    }

    // Call the function to handle "recupere" and "perdu" logic
    recupTirelir(skipTrigger, e, sheet, editedRow, editedColumn);
  }
}