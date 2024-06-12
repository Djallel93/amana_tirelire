function updateListeFrere() {
  const form = FormApp.getActiveForm();
  const QUESTION_TITLE = "Voici la liste des frères disponibles";

  console.log("Récupération du Google Sheets associé");
  const sheetID = form.getDestinationId();

  const dataRange = getSheetDataByID(sheetID, SHEET_DEF.FRERE.SHEET_NAME);

  console.log("Création de la liste des frères");

  const fullNames = dataRange
    .filter(verifyRow)
    .map(
      (row) =>
        row[getColumnIndex("FRERE", "NOM")] +
        " " +
        row[getColumnIndex("FRERE", "PRENOM")]
    )

  if (fullNames.length === 0) fullNames.push("");

  console.log("Nouvelle liste de frères : " + fullNames);

  console.log("Mise à jour de la liste des frères");
  const items = form.getItems(FormApp.ItemType.LIST);
  const listItem = items
    .find((item) => item.getTitle() === QUESTION_TITLE)
    ?.asListItem();

  if (listItem) {
    listItem.setChoiceValues(fullNames);
    console.log("La liste des frères a été mise à jour");
  } else {
    console.error(`Question avec le titre "${QUESTION_TITLE}" non trouvée`);
  }
}

function verifyRow(row) {
  const REQUIRED_COLUMNS = [
    getColumnIndex("FRERE", "NOM"),
    getColumnIndex("FRERE", "PRENOM"),
    getColumnIndex("FRERE", "MAIL"),
    getColumnIndex("FRERE", "ROLE"),
  ];

  return REQUIRED_COLUMNS.every((colIndex) => row[colIndex]);
}
