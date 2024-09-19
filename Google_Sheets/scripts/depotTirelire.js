function depotOldTirelire(sheet, editedRow, calendar) {
  const currentDate = new Date();
  const id_magasin = sheet
    .getRange(editedRow, getRealColumnIndex("TIRELIRE", "ID_MAGASIN"))
    .getValue();
  const responsable = sheet
    .getRange(editedRow, getRealColumnIndex("TIRELIRE", "RESPONSABLE"))
    .getValue();

  // Mise à jour la date_retrait avec la date d'aujourd'hui
  noRollbackSetValue(
    sheet.getRange(editedRow, getRealColumnIndex("TIRELIRE", "DATE_RETRAIT")),
    currentDate
  );

  depotTirelire(sheet, editedRow, id_magasin, responsable, calendar);
}

function depotTirelire(sheet, refRow, id_magasin, responsable, calendar) {
  const newRow = sheet.getLastRow() + 1;
  const currentDate = new Date();

  // Copier la ligne éditée dans la nouvelle ligne
  sheet
    .getRange(refRow, 1, 1, sheet.getLastColumn())
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
  noRollbackSetValue(
    sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "ID_MAGASIN")),
    id_magasin
  );
  noRollbackSetValue(
    sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "RESPONSABLE")),
    responsable
  );

  // Vider les colonnes de la nouvelle ligne
  noRollbackSetValue(
    sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "DATE_RETRAIT")),
    null
  );
  noRollbackSetValue(
    sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "MONTANT")),
    null
  );
  noRollbackSetValue(
    sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "RECUPERE")),
    false
  );
  noRollbackSetValue(
    sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "PERDU")),
    false
  );
  noRollbackSetValue(
    sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "NOTE")),
    0
  );
  noRollbackSetValue(
    sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "COMMENTAIRE")),
    ""
  );

  // Creation de l'événement sur le calendrier
  const event = createCalendarEvent(sheet, newRow, calendar);
  console.log(
    "Événement crée avec succès. Mise à jour de la nouvelle ligne : " + newRow
  );
  noRollbackSetValue(
    sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "ID_EVENT")),
    event.getId()
  );
}
