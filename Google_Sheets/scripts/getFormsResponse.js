function getFormsResponse(e) {
  const calendar = CalendarApp.getDefaultCalendar();

  console.log("Un formulaire a été soumis");

  const formResponse = e.namedValues;
  const tirelireSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    TIRELIRE_DEF.SHEET_NAME
  );
  const tirelireData = tirelireSheet.getDataRange().getValues();

  let montant = "";
  const id_event = getCellValue(formResponse, QUESTIONS_FORMULAIRE.ID_EVENT);

  const note = getCellValue(formResponse, QUESTIONS_FORMULAIRE.NOTE_RECUP);

  const commentaire = getCellValue(
    formResponse,
    QUESTIONS_FORMULAIRE.COMM_RECUP
  );

  if (getCellValue(formResponse, QUESTIONS_FORMULAIRE.TRANSFERER) === "Non") {
    // TODO: Envoyer mail aux admins
    return;
  }

  if (getCellValue(formResponse, QUESTIONS_FORMULAIRE.RECUPEREE) === "Oui") {
    console.log("La tirelire a été récupérée");
    if (
      getCellValue(formResponse, QUESTIONS_FORMULAIRE.CONTENU_CONNU) === "Oui"
    ) {
      montant = getCellValue(
        formResponse,
        QUESTIONS_FORMULAIRE.MONTANT_RECUPERE
      );
    }
    console.log("Recherche de l'événement " + id_event);
    for (var i = 1; i < tirelireData.length; i++) {
      if (tirelireData[i][TIRELIRE_DEF.DATE_RETRAIT.INDEX - 1] === "") {
        if (tirelireData[i][TIRELIRE_DEF.ID_EVENT.INDEX - 1] === id_event) {
          console.log("L'événement a été trouvé. Mise à jour des données...");
          tirelireSheet
            .getRange(i + 1, TIRELIRE_DEF.RECUPERE.INDEX)
            .setValue(true);
          tirelireSheet
            .getRange(i + 1, TIRELIRE_DEF.MONTANT.INDEX)
            .setValue(montant);
          tirelireSheet.getRange(i + 1, TIRELIRE_DEF.NOTE.INDEX).setValue(note);
          tirelireSheet
            .getRange(i + 1, TIRELIRE_DEF.COMMENTAIRE.INDEX)
            .setValue(commentaire);

          getTirelire(
            tirelireSheet,
            i + 1,
            TIRELIRE_DEF.RECUPERE.INDEX,
            calendar
          );
          return;
        }
      }
    }
  } else {
    if (
      getCellValue(formResponse, QUESTIONS_FORMULAIRE.PERDUE_VOLEE) === "Oui"
    ) {
      console.log("La tirelire a été malheureusement perdu");
      console.log("Recherche de l'événement " + id_event);
      for (var i = 1; i < tirelireData.length; i++) {
        if (tirelireData[i][TIRELIRE_DEF.DATE_RETRAIT.INDEX - 1] === "") {
          if (tirelireData[i][TIRELIRE_DEF.ID_EVENT.INDEX - 1] === id_event) {
            console.log("L'événement a été trouvé. Mise à jour des données...");
            tirelireSheet
              .getRange(i + 1, TIRELIRE_DEF.PERDU.INDEX)
              .setValue(true);
            tirelireSheet
              .getRange(i + 1, TIRELIRE_DEF.NOTE.INDEX)
              .setValue(note);
            tirelireSheet
              .getRange(i + 1, TIRELIRE_DEF.COMMENTAIRE.INDEX)
              .setValue(commentaire);

            getTirelire(
              tirelireSheet,
              i + 1,
              TIRELIRE_DEF.PERDU.INDEX,
              calendar
            );
            return;
          }
        }
      }
    } else {
      const pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
      const newDeadline = new Date(
        getCellValue(
          formResponse,
          QUESTIONS_FORMULAIRE.DATE_REPROGRAMMATION
        ).replace(pattern, "$3-$2-$1")
      );
      if (
        getCellValue(formResponse, QUESTIONS_FORMULAIRE.REPROGRAMMER) === "Oui"
      ) {
        console.log("Le frère souhaite reprogrammer la récupération");

        console.log(
          "Creation de l'événement sur le calendrier à la date du " +
            newDeadline
        );

        findAndReScheduleEvent(
          tirelireSheet,
          tirelireData,
          calendar,
          id_event,
          newDeadline
        );
      } else if (
        getCellValue(formResponse, QUESTIONS_FORMULAIRE.TRANSFERER) === "Oui"
      ) {
        newFrere = getCellValue(
          formResponse,
          QUESTIONS_FORMULAIRE.FRERE_SELECTIONNE
        );
        console.log("Le frère souhaite transférer la tirelire à " + newFrere);

        transferResponsable(
          sheet,
          tirelireData,
          calendar,
          id_event,
          newFrere,
          newDeadline
        );
      }
    }
  }
}

function getCellValue(namedValues, question) {
  return namedValues[question][0];
}
