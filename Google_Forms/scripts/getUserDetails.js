function getUserDetailsByMail(email, frereData) {
  for (let i = 1; i < frereData.length; i++) {
    if (frereData[i][FRERE_DEF.MAIL.INDEX - 1] === email) {
      console.log(
        "Le frère " + email + " existe dans la liste des utilisateurs"
      );
      return {
        nom: frereData[i][FRERE_DEF.NOM.INDEX - 1],
        prenom: frereData[i][FRERE_DEF.PRENOM.INDEX - 1],
        email: frereData[i][FRERE_DEF.MAIL.INDEX - 1],
        role: frereData[i][FRERE_DEF.ROLE.INDEX - 1],
      };
    }
  }
  console.error(
    "Le frère " + email + " n'existe pas dans la liste des utilisateurs"
  );
  return null;
}
