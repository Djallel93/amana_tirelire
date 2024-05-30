function getFormsResponse(e) {
  var tirelireSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("tirelire");
  var tirelireData = tirelireSheet
    .getDataRange()
    .getValues()
    .filter(function (row) {
      return row[TIRELIRE_COLUMNS.DATE_RETRAIT - 1] === "";
    });

  var montant = "";
  var id_event = getCellValue(REPONSES_FORMULAIRE.ID_EVENEMENT);

  if (getCellValue(REPONSES_FORMULAIRE.TRANSFERER) === "Non") {
    // TODO: Envoyer mail aux admins
    return;
  }

  if (getCellValue(REPONSES_FORMULAIRE.RECUPEREE) === "Oui") {
    if (getCellValue(REPONSES_FORMULAIRE.CONTENU_CONNU) === "Oui") {
      montant = getCellValue(REPONSES_FORMULAIRE.MONTANT_RECUPERE);
    }
    for (var i = 0; i < tirelireData.length; i++) {
      if (tirelireData[i][TIRELIRE_COLUMNS.ID_EVENT - 1] === id_event) {
        tirelireSheet.getRange(i + 1, TIRELIRE_COLUMNS.RECUPERE).setValue(true);
        tirelireSheet
          .getRange(i + 1, TIRELIRE_COLUMNS.MONTANT)
          .setValue(montant);
        break;
      }
    }
  } else {
    if (getCellValue(REPONSES_FORMULAIRE.PERDUE_VOLEE) === "Oui") {
        for (var i = 0; i < tirelireData.length; i++) {
            if (tirelireData[i][TIRELIRE_COLUMNS.ID_EVENT - 1] === id_event) {
              tirelireSheet.getRange(i + 1, TIRELIRE_COLUMNS.PERDU).setValue(true);
            }
          }
    } else if (getCellValue(REPONSES_FORMULAIRE.REPROGRAMMER) === "Oui") {
      // TODO: Action vider la cellule + delete event
      // TODO: Action createEvent(newDate)
    } else if (getCellValue(REPONSES_FORMULAIRE.TRANSFERER) === "Oui") {
      // TODO: Action changer responsable
      // TODO: Action vider la cellule + delete event
      // TODO: Action changer evenement
    }
  }
}

function getCellValue(column) {
  var sheet = e.source.getActiveSheet();
  var editedRow = e.range.getRow();
  return sheet.getRange(editedRow, column).getValue();
}
