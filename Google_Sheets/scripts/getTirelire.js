function getTirelire(editedRow, editedColumn, calendar) {
  const sheet = getSheetByName(SHEET_DEF.TIRELIRE.SHEET_NAME);
  const currentDate = new Date();
  const cellValue = sheet.getRange(editedRow, editedColumn).getValue();

  console.log("Une tirelire a été mise à jour.");

  if (
    editedColumn === getRealColumnIndex("TIRELIRE", "RECUPERE") ||
    editedColumn === getRealColumnIndex("TIRELIRE", "PERDU")
  ) {
    exclusiveSelect(
      sheet,
      editedRow,
      editedColumn,
      getRealColumnIndex("TIRELIRE", "RECUPERE"),
      getRealColumnIndex("TIRELIRE", "PERDU")
    );
  }

  // Vérifiez si l'édition est dans la colonne 'recupere' ou 'perdu'
  if (
    editedColumn !== getRealColumnIndex("TIRELIRE", "RECUPERE") &&
    editedColumn !== getRealColumnIndex("TIRELIRE", "PERDU")
  ) {
    console.log("L'édition ne concerne pas les colonnes perdu ou récupéré");
    return;
  } else if(!cellValue){
    console.log("L'état de la tirelire n'a pas changé");
    return;
  }

  // Vérifiez si l'édition est dans la colonne 'perdu'
  if (editedColumn === getRealColumnIndex("TIRELIRE", "PERDU") && cellValue) {
    // Mettre le montant à 0
    console.log("L'a tirelire a été perdue mise à jour du montant");
    noRollbackSetValue(sheet.getRange(editedRow, getRealColumnIndex("TIRELIRE", "MONTANT")), 0);
  }

  // Évitez les exécutions multiples en vérifiant si les actions ont déjà été effectuées
  if (
    sheet.getRange(editedRow, getRealColumnIndex("TIRELIRE", "DATE_RETRAIT")).getValue() !== ""
  ) {
    console.warn(
      "Impossible de mettre a jour cette tirelire. Une édition est peut être déjà en cours."
    );
    return;
  }

  // Mise à jour la date_retrait avec la date d'aujourd'hui
  noRollbackSetValue(
    sheet.getRange(editedRow, getRealColumnIndex("TIRELIRE", "DATE_RETRAIT")),
    currentDate
  );

  const newRow = sheet.getLastRow() + 1;

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
    sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "DATE_DEPOT")),
    currentDate
  );

  // Vider les colonnes 'montant', 'recupere' et 'perdu' de la nouvelle ligne
  noRollbackSetValue(
    sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "DATE_RETRAIT")),
    null
  );
  noRollbackSetValue(sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "MONTANT")), null);
  noRollbackSetValue(sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "RECUPERE")), false);
  noRollbackSetValue(sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "PERDU")), false);
  noRollbackSetValue(sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "NOTE")), 0);
  noRollbackSetValue(sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "COMMENTAIRE")), "");

  // Creation de l'événement sur le calendrier
  const event = createCalendarEvent(sheet, editedRow, calendar);
  console.log(
    "Événement crée avec succès. Mise à jour de la nouvelle ligne : " + newRow
  );
  noRollbackSetValue(
    sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "ID_EVENT")),
    event.getId()
  );
  sheet.getRange(editedRow, getRealColumnIndex("TIRELIRE", "ID_EVENT")).setValue("");
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

  console.log("Verification de l’exclusivité des colonnes perdu et récupéré");

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
