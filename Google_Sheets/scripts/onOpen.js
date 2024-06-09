function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Fonctions Personnalisées")
    .addItem("Initialisation des événement", "initCalendarEvents")
    .addSeparator()
    .addSubMenu(
      ui
        .createMenu("Actions manuelles")
        .addItem("Reprogrammer une collecte", "manualReScheduleEvent")
        .addItem("Transférer la responsabilité", "manuelTransferResponsable")
    )
    .addToUi();
}

function initCalendarEvents() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    TIRELIRE_DEF.SHEET_NAME
  );
  const lastRow = sheet.getLastRow();

  console.log("Récupération de l'ID du calendrier de l'utilisateur");
  const calendar = CalendarApp.getDefaultCalendar();

  for (let row = 2; row <= lastRow; row++) {
    const dateRetrait = sheet
      .getRange(row, TIRELIRE_DEF.DATE_RETRAIT.INDEX)
      .getValue();

    const idEvent = sheet.getRange(row, TIRELIRE_DEF.ID_EVENT.INDEX).getValue();

    if (dateRetrait || idEvent) {
      continue;
    }

    const event = createCalendarEvent(
      sheet,
      row,
      calendar,
      sheet.getRange(row, TIRELIRE_DEF.DATE_DEPOT.INDEX).getValue()
    );

    if (!event) {
      showAlert(
        "Impossible de créer l'événement pour le magasin " +
          sheet.getRange(row, TIRELIRE_DEF.MAGASIN.INDEX).getValue() +
          " a la date de dépôt du " +
          sheet.getRange(row, TIRELIRE_DEF.DATE_DEPOT.INDEX).getValue() +
          " sur le calendrier."
      );
      return;
    } else {
      noRollbackSetValue(
        sheet.getRange(row, TIRELIRE_DEF.ID_EVENT.INDEX),
        event.getId(),
        TIRELIRE_DEF.ID_EVENT.TYPE
      );
    }
  }
}

function manualReScheduleEvent() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const formUrl = sheet.getFormUrl();
  const formID = FormApp.openByUrl(formUrl).getId();
  const activeCell = sheet.getActiveCell();
  activeCell.get;
  if (!isIdEventSelected(sheet)) {
    return;
  }

  const url =
    "https://docs.google.com/forms/d/" +
    formID +
    "/viewform?usp=pp_url&entry.2052962151=" +
    activeCell.getValue() +
    "&entry.1995875835=Non&entry.1439777403=Non" +
    "&entry.833798931=Oui";
  showAnchor("Reprogrammer l'événement", url);
}

function manuelTransferResponsable() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const formUrl = sheet.getFormUrl();
  const formID = FormApp.openByUrl(formUrl).getId();
  const activeCell = sheet.getActiveCell();

  if (!isIdEventSelected(sheet)) {
    return;
  }

  const url =
    "https://docs.google.com/forms/d/" +
    formID +
    "/viewform?usp=pp_url&entry.2052962151=" +
    activeCell.getValue() +
    "&entry.1995875835=Non&entry.1439777403=Non" +
    "&entry.833798931=Non&entry.1111832661=Oui";
  showAnchor("Transférer le responsable", url);
}

function showAnchor(name, url) {
  const template = HtmlService.createTemplateFromFile("formsLink");
  template.name = name;
  template.url = url;
  const htmlOutput = template.evaluate().setWidth(400).setHeight(300);
  SpreadsheetApp.getUi().showModelessDialog(
    htmlOutput,
    "Lien vers le formulaire"
  );
}

function isIdEventSelected(sheet) {
  const activeCell = sheet.getActiveCell();

  if (
    !canEditCells(
      sheet.getActiveSheet(),
      activeCell.getRow(),
      Session.getActiveUser().getEmail()
    )
  ) {
    return false;
  }

  if (
    activeCell.getColumn() !== TIRELIRE_DEF.ID_EVENT.INDEX ||
    !activeCell.getColumn()
  ) {
    console.error("La cellule sélectionnée n'est pas un id_event valide");
    showAlert("Veuillez sélectionner une cellule avec un id_event valide.");
    return false;
  }

  return true;
}
