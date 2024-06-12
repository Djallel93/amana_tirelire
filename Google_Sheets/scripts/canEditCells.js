function canEditCells(sheet, editedRow, userMail) {
  if (!sheet || typeof editedRow !== "number" || typeof userMail !== "string") {
    console.error("Paramètres invalides fournis à canEditCells");
    return false;
  }

  console.log(
    "Vérification si le frère actuelle possède le droit de modifier le champs..."
  );
  const currentUser = getUserDetailsByMail(userMail);

  if (!currentUser) {
    console.error("Utilisateur actuel non trouvé pour l'e-mail : " + userMail);
    return false;
  }

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
    .getRange(editedRow, getRealColumnIndex("TIRELIRE", "RESPONSABLE"))
    .getValue();

  const currResponsable = currentUser.nom + " " + currentUser.prenom;

  if (responsable === currResponsable) {
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
