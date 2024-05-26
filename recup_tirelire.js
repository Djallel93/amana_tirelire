function recup_tirelir(e, sheet, editedRow, editedColumn) {
  if (skipTrigger) return;

  var currentDate = new Date();
  var rowRange = sheet.getRange(editedRow, 1, 1, sheet.getLastColumn());
  var formattedDate = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');

  if (editedColumn == tirelireColumns.recupere || editedColumn == tirelireColumns.perdu) {
    exclusiveSelect(sheet, editedRow, editedColumn, tirelireColumns.recupere, tirelireColumns.perdu);
  }

  // Vérifiez si l'édition est dans la colonne 'recupere' ou 'perdu'
  if ((editedColumn == tirelireColumns.recupere && e.value.toLowerCase() == 'true') 
    || (editedColumn == tirelireColumns.perdu && e.value.toLowerCase() == 'true')) {

    rowRange.setBackground('white');
    sheet.getRange(editedRow, tirelireColumns.montant).setValue('');

    // Vérifiez si l'édition est dans la colonne 'perdu'
    if (editedColumn == tirelireColumns.perdu && e.value.toLowerCase() == 'true') {
      // Mettre le montant à 0
      sheet.getRange(editedRow, tirelireColumns.montant).setValue(0);

      // Colorier la ligne en rouge
      rowRange.setBackground('red');
    }

    // Évitez les exécutions multiples en vérifiant si les actions ont déjà été effectuées
    if (sheet.getRange(editedRow, tirelireColumns.date_retrait).getValue() == '') {
      // Met à jour la date_retrait (colonne C) avec la date d'aujourd'hui au format 'yyyy-MM-dd'
      sheet.getRange(editedRow, tirelireColumns.date_retrait).setValue(formattedDate);

      var newRow = sheet.getLastRow() + 1;
      var newRowange = sheet.getRange(newRow, 1, 1, sheet.getLastColumn());
      // Copier la ligne éditée dans la nouvelle ligne
      sheet.getRange(editedRow, 1, 1, sheet.getLastColumn()).copyTo(sheet.getRange(newRow, 1), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
      
      // Init la date de la nouvelle tirelire
      sheet.getRange(newRow, tirelireColumns.date_depot).setValue(formattedDate);

      // Vider les colonnes 'montant', 'recupere' et 'perdu' de la nouvelle ligne
      sheet.getRange(newRow, tirelireColumns.date_retrait).setValue('');
      sheet.getRange(newRow, tirelireColumns.montant).setValue('');
      sheet.getRange(newRow, tirelireColumns.recupere).setValue('');
      sheet.getRange(newRow, tirelireColumns.perdu).setValue('');
      newRowange.setBackground('white');
    }
  }
}

function exclusiveSelect(sheet, editedRow, editedColumn, indexRecupere, indexPerdu) {
  var recupereValue = sheet.getRange(editedRow, indexRecupere).getValue();
  var perduValue = sheet.getRange(editedRow, indexPerdu).getValue();

  skipTrigger = true;
  if (recupereValue && perduValue) {
    if (editedColumn == indexRecupere) {
      sheet.getRange(editedRow, indexPerdu).setValue(false);
    } else {
      sheet.getRange(editedRow, indexRecupere).setValue(false);
    }
  } else {
    if (recupereValue === true) {
      sheet.getRange(editedRow, indexPerdu).setValue(false);
    }

    if (perduValue === true) {
      sheet.getRange(editedRow, indexRecupere).setValue(false);
    }
  }
  skipTrigger = false;
}
