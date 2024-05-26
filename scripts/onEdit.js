const frereColumns = {
  nom: 1,
  prenom: 2,
  mail: 3,
  telephone: 4,
  admin: 5
};

const tirelireColumns = {
  magasin: 1,
  date_depot: 2,
  date_retrait: 3,
  montant: 4,
  recupere: 5,
  perdu: 6,
  responsable: 7
};

function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  var editedColumn = range.getColumn();
  var editedRow = range.getRow();
  var skipCheck = false;
  var skipTrigger = false;

  console.log("Session user: " + e.user);
  console.log("La cellule " + range.getColumn() + range.getRow() + " de la page " + sheet.getName() + " est en cours d'edition...");

  if (sheet.getName() == 'tirelire') {
    console.log("editedColumn : " + editedColumn);
    console.log("responsable : " + tirelireColumns.responsable);
    // Check if user has rights to edit
    if (editedColumn === tirelireColumns.responsable) {
      if (!canEditResponsable(skipCheck, e, range, editedColumn)) {
        return; // Exit if the user is not allowed to edit
      }
    }

    if (!canEditCells(skipCheck, e, sheet, editedRow)) {
      return; // Exit if the user is not allowed to edit
    }

    // Call the function to handle "recupere" and "perdu" logic
    recupTirelir(skipTrigger, e, sheet, editedRow, editedColumn);
  }
}