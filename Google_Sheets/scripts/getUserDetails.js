function getUserDetailsByMail(email, frereData) {
  for (var i = 1; i < frereData.length; i++) {
    if (frereData[i][FRERE_COLUMNS.MAIL - 1] == email) {
      console.log(
        "Le frère " + email + " existe dans la liste des utilisateurs"
      );
      return {
        nom: frereData[i][FRERE_COLUMNS.NOM - 1],
        prenom: frereData[i][FRERE_COLUMNS.PRENOM - 1],
        email: frereData[i][FRERE_COLUMNS.MAIL - 1],
        role: frereData[i][FRERE_COLUMNS.ROLE - 1],
      };
    }
  }
  console.log(
    "Le frère " + email + " n'existe pas dans la liste des utilisateurs"
  );
  return null;
}

function getUserDetailsByName(fullName, frereData) {
  for (var i = 1; i < frereData.length; i++) {
    frereDataFullName = frereData[i][FRERE_COLUMNS.NOM - 1] + " " + frereData[i][FRERE_COLUMNS.PRENOM - 1];
    if (frereDataFullName == fullName) {
      console.log(
        "Le frère " + fullName + " existe dans la liste des utilisateurs"
      );
      return {
        nom: frereData[i][FRERE_COLUMNS.NOM - 1],
        prenom: frereData[i][FRERE_COLUMNS.PRENOM - 1],
        email: frereData[i][FRERE_COLUMNS.MAIL - 1],
        role: frereData[i][FRERE_COLUMNS.ROLE - 1],
      };
    }
  }
  console.log(
    "Le frère " + fullName + " n'existe pas dans la liste des utilisateurs"
  );
  return null;
}
