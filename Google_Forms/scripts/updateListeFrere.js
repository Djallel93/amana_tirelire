function updateListeFrere() {
  const form = FormApp.getActiveForm();
  const questionTitle = "Voici la liste des frères disponibles";

  console.log("Récupération du Google Sheets associé");
  var sheetID = form.getDestinationId();
  const sheet = SpreadsheetApp.openById(sheetID).getSheetByName("frere");
  const dataRange = sheet.getDataRange().getValues();

  console.log("Récupération des information du frère");
  var email = Session.getActiveUser().getEmail();
  var currentUser = getUserDetailsByMail(email, dataRange);

  console.log("Création de la liste des frères");
  var currUserFullName = currentUser.nom + " " + currentUser.prenom;

  const values = dataRange
    .slice(1)
    .filter((row) => verifyRow(row))
    .map((row) => row[FRERE_COLUMNS.NOM - 1] + " " + row[FRERE_COLUMNS.PRENOM - 1])
    .filter((value) => value && value !== currUserFullName);

  console.log("Nouvelle liste de frères : " + values);

  console.log("Mise à jour de la liste des frères");
  var items = form.getItems(FormApp.ItemType.LIST);
  for (let i = 0; i < items.length; i++) {
    if (items[i].getTitle() === questionTitle) {
      let item = items[i].asListItem();
      item.setChoiceValues(values);
      console.log("La liste des frères a été mise à jour");
      break;
    }
  }
}

function verifyRow(row) {
  const REQUIRED_COLUMNS = [
    FRERE_COLUMNS.NOM,
    FRERE_COLUMNS.PRENOM,
    FRERE_COLUMNS.MAIL,
    FRERE_COLUMNS.ROLE,
  ];

  return REQUIRED_COLUMNS.every((colIndex) => row[colIndex - 1]);
}
