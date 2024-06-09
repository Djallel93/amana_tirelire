function canEditCells(sheet, editedRow, userMail) {
  console.log(
    "Vérification si le frère actuelle possède le droit de modifier le champs..."
  );
  const currentUser = getUserDetailsByMail(userMail);

  if (currentUser.role.toLowerCase() === "administrateur") {
    return true;
  }

  if (currentUser.role.toLowerCase() === "lecteur") {
    showAlert(
      "Vous posséder le rôle " +
        currentUser.role +
        ". Vous ne pouvez éditer aucune ligne de ce document"
    );
    return false;
  }

  if (currentUser.role.toLowerCase() !== "administrateur" && editedRow === 1) {
    showAlert(
      "Vous n'êtes pas Administrateur. Vous ne pouvez pas modifier les entêtes."
    );
    return false;
  }

  const responsable = sheet
    .getRange(editedRow, TIRELIRE_DEF.RESPONSABLE.INDEX)
    .getValue();

  const expectedResponsable = currentUser.nom + " " + currentUser.prenom;

  if (responsable === expectedResponsable) {
    return true;
  } else {
    console.error(
      "Le frère actuelle n'est pas autorisé à modifier cette tirelire"
    );
    showAlert(
      "Vous n'êtes pas autorisé à modifier cette tirelire car vous n'en êtes pas responsable."
    );
    return false;
  }
}
