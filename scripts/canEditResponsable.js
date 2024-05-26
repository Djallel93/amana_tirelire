function canEditResponsable(skipCheck, e, range, editedColumn) {
  console.log("Verification si le user actuelle possède le droit de modifier le champs responsable...");
  if (!skipCheck) {
    var userEmail = e.user;
    var frereSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('frere');
    var frereData = frereSheet.getDataRange().getValues();
    var currentUser = getUserDetails(userEmail, frereData);

    console.log("currentUser : " + JSON.stringify(currentUser));

    if (!currentUser) {
      console.log("User not found, currentUser is: " + JSON.stringify(currentUser));
      skipCheck = true;
      range.setValue(e.oldValue);
      showAlert("Le frère " + userEmail + " n'existe pas dans la liste des frères. Merci de vous renseigner auprès de votre administrateur.");
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
  }
}