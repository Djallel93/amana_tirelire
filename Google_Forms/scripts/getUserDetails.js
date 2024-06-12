function getUserDetailsByMail(email, frereData) {
  if (
    typeof email !== "string" ||
    !Array.isArray(frereData) ||
    frereData.length === 0
  ) {
    console.error("Paramètres invalides fournis à getUserDetailsByMail");
    return null;
  }

  const mailIndex = getColumnIndex("FRERE", "MAIL");
  const frere = frereData.find((row) => row[mailIndex] === email);

  if (frere) {
    console.log(`Le frère ${email} existe dans la liste des utilisateurs`);
    return {
      nom: frere[getColumnIndex("FRERE", "NOM")],
      prenom: frere[getColumnIndex("FRERE", "PRENOM")],
      email: frere[getColumnIndex("FRERE", "MAIL")],
      role: frere[getColumnIndex("FRERE", "ROLE")],
    };
  }

  console.error(
    `Le frère ${email} n'existe pas dans la liste des utilisateurs`
  );
  return null;
}
