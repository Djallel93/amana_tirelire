function depotOldTirelire(sheet, editedRow, typeNewTirelire, calendar) {
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

  depotTirelire(sheet, editedRow, id_magasin, responsable, typeNewTirelire, calendar);
}
/**
 * @sheet feuille en cours d'utilisation
 * @refRow {number} Ligne reference a dupliquer. 
 * Pour un premier dépôt elle copie la deuxième ligne. 
 * Sinon, copier la ligne de la tirelire qui vient d'être récupérée
 * @id_magasin {number} id du magasin dans lequel la tirelire est déposée
 * @responsable {string} Nom complet du responsable de la tirelire
 * @typeTirelire {boolean} ouvrable ou non
 * @calendar instance du calendar pour créer un événement
 */
function depotTirelire(sheet, refRow, id_magasin, responsable, typeTirelire, calendar) {
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
    sheet.getRange(newRow, getRealColumnIndex("TIRELIRE", "OUVRABLE")),
    typeTirelire
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
