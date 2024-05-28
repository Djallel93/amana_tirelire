function recupTirelir(e) {
  var sheet = e.source.getActiveSheet();
  var editedRow = e.range.getRow();
  var editedColumn = e.range.getColumn();
  var currentDate = new Date();
  var rowRange = sheet.getRange(editedRow, 1, 1, sheet.getLastColumn());

  if (
    editedColumn == tirelireColumns.recupere ||
    editedColumn == tirelireColumns.perdu
  ) {
    exclusiveSelect(
      sheet,
      editedRow,
      editedColumn,
      tirelireColumns.recupere,
      tirelireColumns.perdu
    );
  }

  // Vérifiez si l'édition est dans la colonne 'recupere' ou 'perdu'
  if (
    (editedColumn == tirelireColumns.recupere &&
      e.value.toLowerCase() === "true") ||
    (editedColumn == tirelireColumns.perdu && e.value.toLowerCase() === "true")
  ) {
    rowRange.setBackground("white");
    noRollbackSetValue(sheet.getRange(editedRow, tirelireColumns.montant), "");
    // Vérifiez si l'édition est dans la colonne 'perdu'
    if (
      editedColumn == tirelireColumns.perdu &&
      e.value.toLowerCase() === "true"
    ) {
      // Mettre le montant à 0
      noRollbackSetValue(sheet.getRange(editedRow, tirelireColumns.montant), 0);

      // Colorier la ligne en rouge
      rowRange.setBackground("#dd0531");
    }

    // Évitez les exécutions multiples en vérifiant si les actions ont déjà été effectuées
    if (
      sheet.getRange(editedRow, tirelireColumns.date_retrait).getValue() == ""
    ) {
      // Met à jour la date_retrait avec la date d'aujourd'hui au format 'yyyy-MM-dd'
      noRollbackSetValue(
        sheet.getRange(editedRow, tirelireColumns.date_retrait),
        currentDate
      );

      var newRow = sheet.getLastRow() + 1;
      var newRowRange = sheet.getRange(newRow, 1, 1, sheet.getLastColumn());

      // Copier la ligne éditée dans la nouvelle ligne
      sheet
        .getRange(editedRow, 1, 1, sheet.getLastColumn())
        .copyTo(
          sheet.getRange(newRow, 1),
          SpreadsheetApp.CopyPasteType.PASTE_NORMAL,
          false
        );

      // Init la date de la nouvelle tirelire
      noRollbackSetValue(
        sheet.getRange(newRow, tirelireColumns.date_depot),
        currentDate
      );

      // Vider les colonnes 'montant', 'recupere' et 'perdu' de la nouvelle ligne
      noRollbackSetValue(
        sheet.getRange(newRow, tirelireColumns.date_retrait),
        ""
      );
      noRollbackSetValue(sheet.getRange(newRow, tirelireColumns.montant), "");
      noRollbackSetValue(sheet.getRange(newRow, tirelireColumns.recupere), "");
      noRollbackSetValue(sheet.getRange(newRow, tirelireColumns.perdu), "");

      newRowRange.setBackground("white");

      // Creation de l'événement sur le calendrier
      createCalendarEvent(e);
    }
  }
}

function exclusiveSelect(
  sheet,
  editedRow,
  editedColumn,
  indexRecupere,
  indexPerdu
) {
  var recupereValue = sheet.getRange(editedRow, indexRecupere).getValue();
  var perduValue = sheet.getRange(editedRow, indexPerdu).getValue();

  if (recupereValue && perduValue) {
    if (editedColumn == indexRecupere) {
      noRollbackSetValue(sheet.getRange(editedRow, indexPerdu), false);
    } else {
      noRollbackSetValue(sheet.getRange(editedRow, indexRecupere), false);
    }
  } else {
    if (recupereValue === true) {
      noRollbackSetValue(sheet.getRange(editedRow, indexPerdu), false);
    }

    if (perduValue === true) {
      noRollbackSetValue(sheet.getRange(editedRow, indexRecupere), false);
    }
  }
}
