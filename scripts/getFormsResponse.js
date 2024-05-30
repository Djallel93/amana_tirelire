function getFormsResponse(e) {
  var calendar = CalendarApp.getDefaultCalendar();

  console.log("Un formulaire a été soumis");

  var data = e.namedValues;
  var tirelireSheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("tirelire");
  var tirelireData = tirelireSheet.getDataRange().getValues();

  var montant = "";
  var id_event = getCellValue(data, QUESTIONS_FORMULAIRE.ID_EVENEMENT);

  if (getCellValue(data, QUESTIONS_FORMULAIRE.TRANSFERER) === "Non") {
    // TODO: Envoyer mail aux admins
    return;
  }

  if (getCellValue(data, QUESTIONS_FORMULAIRE.RECUPEREE) === "Oui") {
    console.log("La tirelire a été récupérée");
    if (getCellValue(data, QUESTIONS_FORMULAIRE.CONTENU_CONNU) === "Oui") {
      montant = getCellValue(data, QUESTIONS_FORMULAIRE.MONTANT_RECUPERE);
    }
    console.log("Recherche de l'événement " + idevent);
    for (var i = 1; i < tirelireData.length; i++) {
      if (tirelireData[i][TIRELIRE_COLUMNS.DATE_RETRAIT - 1] === "") {
        if (tirelireData[i][TIRELIRE_COLUMNS.ID_EVENT - 1] === id_event) {
          console.log("L'événement a été trouvé. Mise a jour des données...");
          tirelireSheet
            .getRange(i + 1, TIRELIRE_COLUMNS.RECUPERE)
            .setValue(true);
          console.log("recupere: " + true);
          tirelireSheet
            .getRange(i + 1, TIRELIRE_COLUMNS.MONTANT)
            .setValue(montant);
          console.log("montant: " + montant);
          getTirelire(
            tirelireSheet,
            i + 1,
            TIRELIRE_COLUMNS.RECUPERE,
            calendar
          );
          return;
        }
      }
    }
  } else {
    if (getCellValue(data, QUESTIONS_FORMULAIRE.PERDUE_VOLEE) === "Oui") {
      console.log("La tirelire a été malheureusement perdu");
      console.log("Recherche de l'événement " + id_event);
      for (var i = 1; i < tirelireData.length; i++) {
        if (tirelireData[i][TIRELIRE_COLUMNS.DATE_RETRAIT - 1] === "") {
          if (tirelireData[i][TIRELIRE_COLUMNS.ID_EVENT - 1] === id_event) {
            console.log("L'événement a été trouvé. Mise a jour des données...");
            tirelireSheet
              .getRange(i + 1, TIRELIRE_COLUMNS.PERDU)
              .setValue(true);
            console.log("perdu: " + true);
            getTirelire(tirelireSheet, i + 1, TIRELIRE_COLUMNS.PERDU, calendar);
            return;
          }
        }
      }
    } else if (
      getCellValue(data, QUESTIONS_FORMULAIRE.REPROGRAMMER) === "Oui"
    ) {
      console.log("Le frère souhaite reprogrammer la récupération");
      console.log("Recherche de l'événement " + id_event);
      for (var i = 1; i < tirelireData.length; i++) {
        if (tirelireData[i][TIRELIRE_COLUMNS.ID_EVENT - 1] === id_event) {
          console.log("Suppression de l'événement");
          const event = CalendarApp.getEventById(id_event);
          event.deleteEvent();
          tirelireSheet.getRange(i + 1, TIRELIRE_COLUMNS.ID_EVENT).setValue("");

          console.log("Creation de l'événement sur le calendrier");
          console.log(
            "DATE_REPROGRAMMATION" +
              getCellValue(data, QUESTIONS_FORMULAIRE.DATE_REPROGRAMMATION)
          );
          var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
          var newDeadline = new Date(
            getCellValue(
              data,
              QUESTIONS_FORMULAIRE.DATE_REPROGRAMMATION
            ).replace(pattern, "$3-$2-$1")
          );
          var newEvent = createCalendarEvent(
            tirelireSheet,
            i + 1,
            calendar,
            newDeadline
          );
          console.log(
            "Événement crée avec succès a la date du " +
              newDeadline +
              ". Mise a jour de la nouvelle ligne..."
          );
          noRollbackSetValue(
            tirelireSheet.getRange(i + 1, TIRELIRE_COLUMNS.ID_EVENT),
            newEvent.getId()
          );
        }
      }
    } else if (getCellValue(data, QUESTIONS_FORMULAIRE.TRANSFERER) === "Oui") {
      newFrere = getCellValue(data, QUESTIONS_FORMULAIRE.FRERE_SELECTIONNE);
      console.log("Le frère souhaite transferer la tirelire a " + newFrere);
      console.log("Recherche de l'événement " + id_event);
      for (var i = 1; i < tirelireData.length; i++) {
        if (tirelireData[i][TIRELIRE_COLUMNS.ID_EVENT - 1] === id_event) {
          console.log("Changement du responsable");
          noRollbackSetValue(
            tirelireSheet.getRange(i + 1, TIRELIRE_COLUMNS.RESPONSABLE),
            newFrere
          );
          console.log("Suppression de l'événement");
          const event = CalendarApp.getEventById(id_event);
          event.deleteEvent();
          tirelireSheet.getRange(i + 1, TIRELIRE_COLUMNS.ID_EVENT).setValue("");

          console.log("Création de l'événement sur le calendrier");
          var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
          var newDeadline = new Date(
            getCellValue(
              data,
              QUESTIONS_FORMULAIRE.DATE_REPROGRAMMATION
            ).replace(pattern, "$3-$2-$1")
          );
          var newEvent = createCalendarEvent(
            tirelireSheet,
            i + 1,
            calendar,
            newDeadline
          );
          console.log(
            "Événement crée avec succès. Mise a jour de la nouvelle ligne..."
          );
          noRollbackSetValue(
            tirelireSheet.getRange(i + 1, TIRELIRE_COLUMNS.ID_EVENT),
            newEvent.getId()
          );
        }
      }
    }
  }
  return;
}

function getCellValue(data, question) {
  return data[question][0];
}
