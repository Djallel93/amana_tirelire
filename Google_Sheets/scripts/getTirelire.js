function getTirelire(editedRow, editedColumn, calendar) {
  const tirelireSheet = getSheetByName(SHEET_DEF.TIRELIRE.SHEET_NAME);
  const cellValue = tirelireSheet.getRange(editedRow, editedColumn).getValue();

  console.log("Une tirelire a été mise à jour.");

  if (
    editedColumn === getRealColumnIndex("TIRELIRE", "RECUPERE") ||
    editedColumn === getRealColumnIndex("TIRELIRE", "PERDU")
  ) {
    exclusiveSelect(
      tirelireSheet,
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
  } else if (!cellValue) {
    console.log("L'état de la tirelire n'a pas changé");
    return;
  }

  // Vérifiez si l'édition est dans la colonne 'perdu'
  if (editedColumn === getRealColumnIndex("TIRELIRE", "PERDU") && cellValue) {
    // Mettre le montant à 0
    console.log("L'a tirelire a été perdue mise à jour du montant");
    noRollbackSetValue(
      tirelireSheet.getRange(
        editedRow,
        getRealColumnIndex("TIRELIRE", "MONTANT")
      ),
      0
    );
  }

  // Évitez les exécutions multiples en vérifiant si les actions ont déjà été effectuées
  if (
    tirelireSheet
      .getRange(editedRow, getRealColumnIndex("TIRELIRE", "DATE_RETRAIT"))
      .getValue() !== ""
  ) {
    console.warn(
      "Impossible de mettre a jour cette tirelire. Une édition est peut être déjà en cours."
    );
    return;
  }

  depotOldTirelire(tirelireSheet, editedRow, calendar);
}

function exclusiveSelect(
  tirelireSheet,
  editedRow,
  editedColumn,
  indexRecupere,
  indexPerdu
) {
  const recupereValue = tirelireSheet
    .getRange(editedRow, indexRecupere)
    .getValue();
  const perduValue = tirelireSheet.getRange(editedRow, indexPerdu).getValue();

  console.log("Verification de l’exclusivité des colonnes perdu et récupéré");

  if (recupereValue && perduValue) {
    if (editedColumn === indexRecupere) {
      noRollbackSetValue(tirelireSheet.getRange(editedRow, indexPerdu), false);
    } else {
      noRollbackSetValue(
        tirelireSheet.getRange(editedRow, indexRecupere),
        false
      );
    }
  } else {
    if (recupereValue === true) {
      noRollbackSetValue(tirelireSheet.getRange(editedRow, indexPerdu), false);
    }

    if (perduValue === true) {
      noRollbackSetValue(
        tirelireSheet.getRange(editedRow, indexRecupere),
        false
      );
    }
  }
}
