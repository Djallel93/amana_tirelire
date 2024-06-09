function getTirelire(sheet, editedRow, editedColumn, calendar) {
  const currentDate = new Date();
  const rowRange = sheet.getRange(editedRow, 1, 1, sheet.getLastColumn());
  const cellValue = sheet.getRange(editedRow, editedColumn).getValue();

  if (
    editedColumn === TIRELIRE_DEF.RECUPERE.INDEX ||
    editedColumn === TIRELIRE_DEF.PERDU.INDEX
  ) {
    exclusiveSelect(
      sheet,
      editedRow,
      editedColumn,
      TIRELIRE_DEF.RECUPERE.INDEX,
      TIRELIRE_DEF.PERDU.INDEX
    );
  }

  // Vérifiez si l'édition est dans la colonne 'recupere' ou 'perdu'
  if (
    (editedColumn === TIRELIRE_DEF.RECUPERE.INDEX && cellValue) ||
    (editedColumn === TIRELIRE_DEF.PERDU.INDEX && cellValue)
  ) {
    rowRange.setBackground("white");
    // Vérifiez si l'édition est dans la colonne 'perdu'
    if (editedColumn === TIRELIRE_DEF.PERDU.INDEX && cellValue) {
      // Mettre le montant à 0
      noRollbackSetValue(
        sheet.getRange(editedRow, TIRELIRE_DEF.MONTANT.INDEX),
        0,
        TIRELIRE_DEF.MONTANT.TYPE
      );

      // Colorier la ligne en rouge
      rowRange.setBackground("#dd0531");
    }

    // Évitez les exécutions multiples en vérifiant si les actions ont déjà été effectuées
    if (
      sheet.getRange(editedRow, TIRELIRE_DEF.DATE_RETRAIT.INDEX).getValue() ===
      ""
    ) {
      // Met à jour la date_retrait avec la date d'aujourd'hui
      noRollbackSetValue(
        sheet.getRange(editedRow, TIRELIRE_DEF.DATE_RETRAIT.INDEX),
        currentDate,
        TIRELIRE_DEF.DATE_RETRAIT.TYPE
      );

      const newRow = sheet.getLastRow() + 1;
      const newRowRange = sheet.getRange(newRow, 1, 1, sheet.getLastColumn());

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
        sheet.getRange(newRow, TIRELIRE_DEF.DATE_DEPOT.INDEX),
        currentDate,
        TIRELIRE_DEF.DATE_DEPOT.TYPE
      );

      // Vider les colonnes 'montant', 'recupere' et 'perdu' de la nouvelle ligne
      noRollbackSetValue(
        sheet.getRange(newRow, TIRELIRE_DEF.DATE_RETRAIT.INDEX),
        "",
        TIRELIRE_DEF.DATE_RETRAIT.TYPE
      );
      noRollbackSetValue(
        sheet.getRange(newRow, TIRELIRE_DEF.MONTANT.INDEX),
        "",
        TIRELIRE_DEF.MONTANT.TYPE
      );
      noRollbackSetValue(
        sheet.getRange(newRow, TIRELIRE_DEF.RECUPERE.INDEX),
        false,
        TIRELIRE_DEF.RECUPERE.TYPE
      );
      noRollbackSetValue(
        sheet.getRange(newRow, TIRELIRE_DEF.PERDU.INDEX),
        false,
        TIRELIRE_DEF.PERDU.TYPE
      );

      newRowRange.setBackground("white");

      // Creation de l'événement sur le calendrier
      const event = createCalendarEvent(sheet, editedRow, calendar);
      console.log(
        "Événement crée avec succès. Mise à jour de la nouvelle ligne : " +
          newRow
      );
      noRollbackSetValue(
        sheet.getRange(newRow, TIRELIRE_DEF.ID_EVENT.INDEX),
        event.getId(),
        TIRELIRE_DEF.ID_EVENT.TYPE
      );
      sheet.getRange(editedRow, TIRELIRE_DEF.ID_EVENT.INDEX).setValue("");
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
  const recupereValue = sheet.getRange(editedRow, indexRecupere).getValue();
  const perduValue = sheet.getRange(editedRow, indexPerdu).getValue();

  if (recupereValue && perduValue) {
    if (editedColumn === indexRecupere) {
      noRollbackSetValue(
        sheet.getRange(editedRow, indexPerdu),
        false,
        TIRELIRE_DEF.PERDU.TYPE
      );
    } else {
      noRollbackSetValue(
        sheet.getRange(editedRow, indexRecupere),
        false,
        TIRELIRE_DEF.PERDU.TYPE
      );
    }
  } else {
    if (recupereValue === true) {
      noRollbackSetValue(
        sheet.getRange(editedRow, indexPerdu),
        false,
        TIRELIRE_DEF.PERDU.TYPE
      );
    }

    if (perduValue === true) {
      noRollbackSetValue(
        sheet.getRange(editedRow, indexRecupere),
        false,
        TIRELIRE_DEF.PERDU.TYPE
      );
    }
  }
}
