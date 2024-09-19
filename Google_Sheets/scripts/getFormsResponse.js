function getFormsResponse(e) {
  console.log("Un formulaire a été soumis");

  const calendar = CalendarApp.getDefaultCalendar();

  const formResponses = e.namedValues;
  const tirelireSheet = getSheetByName(SHEET_DEF.TIRELIRE.SHEET_NAME);
  const tirelireData = getSheetDataByName(SHEET_DEF.TIRELIRE.SHEET_NAME);
  const questions = SHEET_DEF.QUESTIONS_FORM;

  const id_magasin = getFormQuestion(formResponses, questions.ID_MAGASIN);
  const note = getFormQuestion(formResponses, questions.NOTE_RECUP);
  const commentaire = getFormQuestion(formResponses, questions.COMM_RECUP);
  const currResponsableMail = getFormQuestion(formResponses, questions.EMAIL);

  const currentUser = getUserDetailsByMail(currResponsableMail);

  if (!currentUser) {
    console.error(
      "Utilisateur actuel non trouvé pour l'e-mail : " + currResponsableMail
    );
    return;
  }

  console.log("Récupération des information de la tirelire");
  const targetRow = findEventRow(tirelireData, id_magasin);

  if (getFormQuestion(formResponses, questions.TRANSFERER) === "Non") {
    console.warn("Le frère est dans l'incapacité de récupérer sa tirelire");

    if (!targetRow) {
      console.error("Aucune tirelire n'a été déposée pour ce magasin");
      return;
    }

    const frereData = getSheetDataByName(SHEET_DEF.FRERE.SHEET_NAME);
    console.log("Récupération de la liste des administrateurs à notifier");

    const listAdmin = frereData
      .filter(
        (row) =>
          row[getColumnIndex("FRERE", "ROLE")].toLowerCase() ===
          "administrateur"
      )
      .map((row) => row[getColumnIndex("FRERE", "MAIL")])
      .join(",");

    console.log("La tirelire existe. Traitement de la réponse...");
    const rowIndex = tirelireData.indexOf(targetRow) + 2;
    const currMagasin = tirelireSheet
      .getRange(rowIndex, getRealColumnIndex("TIRELIRE", "ID_MAGASIN"))
      .getValue();

    const subject = "Tirelire du magasin " + currMagasin;
    const body =
      "Le frère " +
      currentUser.nom +
      " " +
      currentUser.prenom +
      " est dans l'incapacité de récupérer sa tirelire pour les raisons suivantes : \n\n" +
      commentaire;
    const options = {
      name: "AMANA",
      noReply: true,
    };
    try {
      MailApp.sendEmail(listAdmin, subject, body, options);
    } catch (error) {
      console.error("Échec de l'envoi du mail: " + error.toString());
    }
    return;
  }

  const cdtDeposee =
    getFormQuestion(formResponses, questions.ACTION) === "Déposer une tirelire";
  const cdtRecuperee =
    getFormQuestion(formResponses, questions.RECUPEREE) === "Oui";
  const cdtPerdueVolee =
    getFormQuestion(formResponses, questions.PERDUE_VOLEE) === "Oui";
  const cdtReprogrammer =
    getFormQuestion(formResponses, questions.REPROGRAMMER) === "Oui";
  const cdtTransferer =
    getFormQuestion(formResponses, questions.TRANSFERER) === "Oui";
  const typeTirelire =
    getFormQuestion(formResponses, questions.OUVRABLE) === "Oui";
  const rowIndex = tirelireData.indexOf(targetRow) + 2;

  if (cdtDeposee) {
    console.log("Une nouvelle tirelire a été déposée");
    console.log("Mise à jour des données...");

    const fullName = currentUser.nom + " " + currentUser.prenom;
    depotTirelire(tirelireSheet, 2, id_magasin, fullName, calendar);
  } else if (!targetRow) {
    console.error("Aucune tirelire n'a été déposée pour ce magasin");
    return;
  } else if (cdtRecuperee) {
    console.log("La tirelire a été récupérée");

    console.log("Mise à jour des données...");
    tirelireSheet
      .getRange(rowIndex, getRealColumnIndex("TIRELIRE", "RECUPERE"))
      .setValue(true);
    tirelireSheet
      .getRange(rowIndex, getRealColumnIndex("TIRELIRE", "NOTE"))
      .setValue(note);
    tirelireSheet
      .getRange(rowIndex, getRealColumnIndex("TIRELIRE", "COMMENTAIRE"))
      .setValue(commentaire);

    getTirelire(rowIndex, getRealColumnIndex("TIRELIRE", "RECUPERE"), typeTirelire, calendar);
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

    getTirelire(rowIndex, getRealColumnIndex("TIRELIRE", "PERDU"), typeTirelire, calendar);
  } else {
    const pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
    const newDeadline = new Date(
      getFormQuestion(formResponses, questions.DATE_REPROGRAMMATION).replace(
        pattern,
        "$3-$2-$1"
      )
    );
    const id_event = tirelireSheet
      .getRange(rowIndex, getRealColumnIndex("TIRELIRE", "ID_EVENT"))
      .getValue();

    if (cdtReprogrammer) {
      console.log("Le frère souhaite reprogrammer la récupération");
      console.log(
        `Creation de l'événement sur le calendrier à la date du ${newDeadline}`
      );

      findAndReScheduleEvent(calendar, id_event, newDeadline);
    } else if (cdtTransferer) {
      const newFrere = getFormQuestion(
        formResponses,
        questions.FRERE_SELECTIONNE
      );
      console.log(`Le frère souhaite transférer la tirelire à ${newFrere}`);

      transferResponsable(calendar, id_event, newFrere, newDeadline);
    }
  }
}

function findEventRow(tirelireData, id_magasin) {
  return tirelireData.find(
    (row) =>
      row[getColumnIndex("TIRELIRE", "DATE_RETRAIT")] === "" &&
      row[getColumnIndex("TIRELIRE", "ID_MAGASIN")] == id_magasin
  );
  // Ajouter un filtre pour ne garder que le magasin avec la date de dépôt la plus récente
}
