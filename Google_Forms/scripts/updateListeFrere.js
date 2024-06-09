function updateListeFrere() {
  const form = FormApp.getActiveForm();
  const questionTitle = "Voici la liste des frères disponibles";

  console.log("Récupération du Google Sheets associé");
  const sheetID = form.getDestinationId();
  const sheet = SpreadsheetApp.openById(sheetID).getSheetByName(
    FRERE_DEF.SHEET_NAME
  );
  const dataRange = sheet.getDataRange().getValues();

  console.log("Récupération des information du frère");
  const email = Session.getActiveUser().getEmail();
  const currentUser = getUserDetailsByMail(email, dataRange);

  console.log("Création de la liste des frères");
  const currUserFullName = currentUser.nom + " " + currentUser.prenom;

  const values = dataRange
    .slice(1)
    .filter((row) => verifyRow(row))
    .map(
      (row) =>
        row[FRERE_DEF.NOM.INDEX - 1] + " " + row[FRERE_DEF.PRENOM.INDEX - 1]
    )
    .filter((value) => value && value !== currUserFullName);
  if (values.length === 0) {
    values.push("");
  }
  console.log("Nouvelle liste de frères : " + values);

  console.log("Mise à jour de la liste des frères");
  const items = form.getItems(FormApp.ItemType.LIST);
  for (let i = 0; i < items.length; i++) {
    if (items[i].getTitle() === questionTitle) {
      const item = items[i].asListItem();
      item.setChoiceValues(values);
      console.log("La liste des frères a été mise à jour");
      break;
    }
  }
}

function verifyRow(row) {
  const REQUIRED_COLUMNS = [
    FRERE_DEF.NOM.INDEX,
    FRERE_DEF.PRENOM.INDEX,
    FRERE_DEF.MAIL.INDEX,
    FRERE_DEF.ROLE.INDEX,
  ];

  return REQUIRED_COLUMNS.every((colIndex) => row[colIndex - 1]);
}
