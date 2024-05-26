var skipCheck = false;
var skipTrigger = false;

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

  if (sheet.getName() == 'tirelire') {
    if (!can_edit(e, sheet, range, editedRow, editedColumn)) {
      return; // Exit if the user is not allowed to edit
    }
  
    // Call the function to handle "recupere" and "perdu" logic
    recup_tirelir(e, sheet, editedRow, editedColumn);
  }
}