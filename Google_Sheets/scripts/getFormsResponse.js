function getFormsResponse(e) {
  const calendar = CalendarApp.getDefaultCalendar();

  console.log("Un formulaire a été soumis");

  const formResponses = e.namedValues;
  const tirelireData = getSheetDataByName(SHEET_DEF.TIRELIRE.SHEET_NAME);
  const tirelireSheet = getSheetByName(SHEET_DEF.TIRELIRE.SHEET_NAME);
  const questions = SHEET_DEF.QUESTIONS_FORM;
  let montant = "";
  const id_event = getFormQuestion(formResponses, questions.ID_EVENT);
  const note = getFormQuestion(formResponses, questions.NOTE_RECUP);
  const commentaire = getFormQuestion(formResponses, questions.COMM_RECUP);

  if (getFormQuestion(formResponses, questions.TRANSFERER) === "Non") {
    // TODO: Envoyer mail aux admins
    return;
  }

  const cdtRecuperee =
    getFormQuestion(formResponses, questions.RECUPEREE) === "Oui";
  const cdtPerdueVolee =
    getFormQuestion(formResponses, questions.PERDUE_VOLEE) === "Oui";
  const cdtReprogrammer =
    getFormQuestion(formResponses, questions.REPROGRAMMER) === "Oui";
  const cdtTransferer =
    getFormQuestion(formResponses, questions.TRANSFERER) === "Oui";

  const targetRow = tirelireData.find((row) => {
    if (row[getColumnIndex("TIRELIRE", "DATE_RETRAIT")] === "") {
      return row[getColumnIndex("TIRELIRE", "ID_EVENT")] === id_event;
    }
    return false;
  });

  if (!targetRow) {
    console.error(`Aucun événement trouvé avec l'ID ${id_event}`);
    return;
  }

  console.log(
    `L'événement ${id_event} a été trouvé. Traitement de la réponse...`
  );
  const rowIndex = tirelireData.indexOf(targetRow) + 2;

  if (cdtRecuperee) {
    console.log("La tirelire a été récupérée");
    if (getFormQuestion(formResponses, questions.CONTENU_CONNU) === "Oui") {
      montant = getFormQuestion(formResponses, questions.MONTANT_RECUPERE);
    }

    console.log("Mise à jour des données...");
    tirelireSheet
      .getRange(rowIndex, getRealColumnIndex("TIRELIRE", "RECUPERE"))
      .setValue(true);
    tirelireSheet
      .getRange(rowIndex, getRealColumnIndex("TIRELIRE", "MONTANT"))
      .setValue(montant);
    tirelireSheet
      .getRange(rowIndex, getRealColumnIndex("TIRELIRE", "NOTE"))
      .setValue(note);
    tirelireSheet
      .getRange(rowIndex, getRealColumnIndex("TIRELIRE", "COMMENTAIRE"))
      .setValue(commentaire);

    getTirelire(rowIndex, getRealColumnIndex("TIRELIRE", "RECUPERE"), calendar);
  } else if (cdtPerdueVolee) {
    console.log("La tirelire a été malheureusement perdu");
    console.log("Mise à jour des données...");
    tirelireSheet
      .getRange(rowIndex, getRealColumnIndex("TIRELIRE", "PERDU"))
      .setValue(true);
    tirelireSheet
      .getRange(rowIndex, getRealColumnIndex("TIRELIRE", "NOTE"))
      .setValue(note);
    tirelireSheet
      .getRange(rowIndex, getRealColumnIndex("TIRELIRE", "COMMENTAIRE"))
      .setValue(commentaire);

    getTirelire(rowIndex, getRealColumnIndex("TIRELIRE", "PERDU"), calendar);
  } else {
    const pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
    const newDeadline = new Date(
      getFormQuestion(formResponses, questions.DATE_REPROGRAMMATION).replace(
        pattern,
        "$3-$2-$1"
      )
    );

    if (cdtReprogrammer) {
      console.log("Le frère souhaite reprogrammer la récupération");
      console.log(
        `Creation de l'événement sur le calendrier à la date du ${newDeadline}`
      );

      findAndReScheduleEvent(
        calendar,
        id_event,
        newDeadline
      );
    } else if (cdtTransferer) {
      const newFrere = getFormQuestion(
        formResponses,
        questions.FRERE_SELECTIONNE
      );
      console.log(`Le frère souhaite transférer la tirelire à ${newFrere}`);

      transferResponsable(
        calendar,
        id_event,
        newFrere,
        newDeadline
      );
    }
  }
}
