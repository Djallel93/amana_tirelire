function can_edit(e, sheet, range, editedRow, editedColumn) {
  if (skipCheck) return true; // Allow the edit to proceed if skipCheck is true

  var userEmail = Session.getActiveUser().getEmail();
  var frereSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('frere');
  var frereData = frereSheet.getDataRange().getValues();
  var currentUser = getUserDetails(userEmail, frereData);

  if (!currentUser) {
    // If the user is not found in the "frere" sheet, revert the change and notify
    skipCheck = true;
    range.setValue(e.oldValue);
    showAlert('Utilisateur non autorisé.');
    skipCheck = false;
    return false;
  }

  // If the user is trying to modify the "responsable" column
  if (editedColumn == tirelireColumns.responsable) {
    var newResponsable = e.value;
    var oldResponsable = e.oldValue;
    var expectedResponsable = currentUser.nom + ' ' + currentUser.prenom;

    // Allow only admins to change the "responsable" to any value
    if (!currentUser.admin) {
      // Allow users to change their own name in "responsable" to another name
      if (oldResponsable === expectedResponsable) {
        return true; // Allow the change
      } else if (newResponsable === expectedResponsable) {
        // Prevent users from assigning themselves unless they are already responsible
        skipCheck = true;
        range.setValue(e.oldValue);
        showAlert('Vous ne pouvez pas vous attribuer cette ligne.');
        skipCheck = false;
        return false;
      } else {
        // Prevent changing to another user's name if not admin
        skipCheck = true;
        range.setValue(e.oldValue);
        showAlert('Vous ne pouvez pas modifier cette ligne.');
        skipCheck = false;
        return false;
      }
    }
  }

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

function showAlert(message) {
  SpreadsheetApp.getUi().alert(message);
}

function getUserDetails(email, frereData) {
  for (var i = 1; i < frereData.length; i++) {
    if (frereData[i][2] === email) {
      return {
        nom: frereData[i][0],
        prenom: frereData[i][1],
        admin: frereData[i][4] === true
      };
    }
  }
  return null;
}

function isUserAuthorized(sheet, editedRow, currentUser) {
  var responsable = sheet.getRange(editedRow, tirelireColumns.responsable).getValue();
  if (currentUser.admin) {
    return true;
  }
  var expectedResponsable = currentUser.nom + ' ' + currentUser.prenom;
  return responsable === expectedResponsable;
}
