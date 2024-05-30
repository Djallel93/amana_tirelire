function getTirelire(sheet, editedRow, editedColumn, calendar) {
  var currentDate = new Date();
  var rowRange = sheet.getRange(editedRow, 1, 1, sheet.getLastColumn());
  var cellValue = sheet.getRange(editedRow, editedColumn).getValue();

  if (
    editedColumn === TIRELIRE_COLUMNS.RECUPERE ||
    editedColumn === TIRELIRE_COLUMNS.PERDU
  ) {
    exclusiveSelect(
      sheet,
      editedRow,
      editedColumn,
      TIRELIRE_COLUMNS.RECUPERE,
      TIRELIRE_COLUMNS.PERDU
    );
  }

  // Vérifiez si l'édition est dans la colonne 'recupere' ou 'perdu'
  if (
    (editedColumn === TIRELIRE_COLUMNS.RECUPERE && cellValue) ||
    (editedColumn === TIRELIRE_COLUMNS.PERDU && cellValue)
  ) {
    rowRange.setBackground("white");
    // Vérifiez si l'édition est dans la colonne 'perdu'
    if (editedColumn === TIRELIRE_COLUMNS.PERDU && cellValue) {
      // Mettre le montant à 0
      noRollbackSetValue(
        sheet.getRange(editedRow, TIRELIRE_COLUMNS.MONTANT),
        0
      );

      // Colorier la ligne en rouge
      rowRange.setBackground("#dd0531");
    }

    // Évitez les exécutions multiples en vérifiant si les actions ont déjà été effectuées
    if (
      sheet.getRange(editedRow, TIRELIRE_COLUMNS.DATE_RETRAIT).getValue() === ""
    ) {
      // Met à jour la date_retrait avec la date d'aujourd'hui
      noRollbackSetValue(
        sheet.getRange(editedRow, TIRELIRE_COLUMNS.DATE_RETRAIT),
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
        sheet.getRange(newRow, TIRELIRE_COLUMNS.DATE_DEPOT),
        currentDate
      );

      // Vider les colonnes 'montant', 'recupere' et 'perdu' de la nouvelle ligne
      noRollbackSetValue(
        sheet.getRange(newRow, TIRELIRE_COLUMNS.DATE_RETRAIT),
        ""
      );
      noRollbackSetValue(sheet.getRange(newRow, TIRELIRE_COLUMNS.MONTANT), "");
      noRollbackSetValue(
        sheet.getRange(newRow, TIRELIRE_COLUMNS.RECUPERE),
        false
      );
      noRollbackSetValue(sheet.getRange(newRow, TIRELIRE_COLUMNS.PERDU), false);

      newRowRange.setBackground("white");

      // Creation de l'événement sur le calendrier
      var event = createCalendarEvent(sheet, editedRow, calendar);
      console.log(
        "Événement crée avec succès. Mise a jour de la nouvelle ligne : " +
          newRow
      );
      noRollbackSetValue(
        sheet.getRange(newRow, TIRELIRE_COLUMNS.ID_EVENT),
        event.getId()
      );
      sheet.getRange(editedRow, TIRELIRE_COLUMNS.ID_EVENT).setValue("");
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
    if (editedColumn === indexRecupere) {
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
