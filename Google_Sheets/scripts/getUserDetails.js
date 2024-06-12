function getUserDetailsByMail(email) {
  if (typeof email !== "string") {
    console.error("Paramètres invalides fournis à getUserDetailsByMail");
    return null;
  }

  const frereData = getSheetDataByName(SHEET_DEF.FRERE.SHEET_NAME);

  const mailIndex = getColumnIndex("FRERE", "MAIL");
  const frere = frereData.find((row) => row[mailIndex] === email);

  if (frere) {
    console.log(`Le frère ${email} existe dans la liste des utilisateurs`);
    return {
      nom: frere[getColumnIndex("FRERE", "NOM")],
      prenom: frere[getColumnIndex("FRERE", "PRENOM")],
      email: frere[mailIndex],
      role: frere[getColumnIndex("FRERE", "ROLE")],
    };
  }

  console.error(
    `Le frère ${email} n'existe pas dans la liste des utilisateurs`
  );
  return null;
}

function getUserDetailsByName(fullName) {
  if (typeof fullName !== "string") {
    console.error("Paramètres invalides fournis à getUserDetailsByName");
    return null;
  }

  const frereData = getSheetDataByName(SHEET_DEF.FRERE.SHEET_NAME);
  const nomIndex = getColumnIndex("FRERE", "NOM");
  const prenomIndex = getColumnIndex("FRERE", "PRENOM");
  const frere = frereData.find((row) => {
    const fullNameFrere = row[nomIndex] + " " + row[prenomIndex];
    return fullNameFrere === fullName;
  });

  if (frere) {
    console.log(`Le frère ${fullName} existe dans la liste des utilisateurs`);
    return {
      nom: frere[nomIndex],
      prenom: frere[prenomIndex],
      email: frere[getColumnIndex("FRERE", "MAIL")],
      role: frere[getColumnIndex("FRERE", "ROLE")],
    };
  }
}
