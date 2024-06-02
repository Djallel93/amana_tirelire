function canEditCells(e, currentUser) {
  var sheet = e.source.getActiveSheet();
  var editedRow = e.range.getRow();
  var editedColumn = e.range.getColumn();
  console.log(
    "Vérification si le frère actuelle possède le droit de modifier le champs..."
  );

  if (currentUser.role.toLowerCase() === "lecteur") {
    // Annuler la modification si l'utilisateur n'est pas autorisé
    noRollbackSetValue(e.range, e.oldValue);
    showAlert(
      "Vous posséder le rôle " +
        currentUser.role +
        ". Vous ne pouvez éditer aucune ligne de ce document"
    );
    return false;
  }

  // Tous les administrateur peuvent modifier n'importe quel responsable
  if (currentUser.role.toLowerCase() != "administrateur") {
    if (sheet.getName() == TIRELIRE_DEF.SHEET_NAME && range.getRow() > 1) {
      if (editedColumn == TIRELIRE_DEF.RESPONSABLE) {
        return canEditResponsable(e, currentUser);
      }

      var responsable = sheet
        .getRange(editedRow, TIRELIRE_DEF.RESPONSABLE)
        .getValue();

      var expectedResponsable = currentUser.nom + " " + currentUser.prenom;

      if (responsable === expectedResponsable) {
        return true;
      } else {
        noRollbackSetValue(e.range, e.oldValue);
        showAlert(
          "Vous n'êtes pas autorisé à modifier cette tirelire car vous n'en êtes pas responsable."
        );
        return false;
      }
    }
  }

  console.log("Le frère actuelle possède le droit de modifier le champs...");
  return true;
}
