function canEditCells(skipCheck, e, sheet, editedRow) {
  console.log("Verification si le user actuelle possede le droit de modifier le champs...");
  if (!skipCheck) {
    var userEmail = e.user;
    var frereSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('frere');
    var frereData = frereSheet.getDataRange().getValues();
    var currentUser = getUserDetails(userEmail, frereData);

    // Check if the user is authorized to edit the row
    if (!isUserAuthorized(sheet, editedRow, currentUser)) {
      // Annuler la modification si l'utilisateur n'est pas autorisé
      skipCheck = true;
      e.range.setValue(e.oldValue);
      showAlert('Vous n\'êtes pas autorisé à modifier cette ligne.');
      skipCheck = false;
      return false;
    }

    return true;
  }

  function isUserAuthorized(sheet, editedRow, currentUser) {
    var responsable = sheet.getRange(editedRow, tirelireColumns.responsable).getValue();
    if (currentUser.admin) {
      return true;
    }
    var expectedResponsable = currentUser.nom + ' ' + currentUser.prenom;
    return responsable === expectedResponsable;
  }
}
