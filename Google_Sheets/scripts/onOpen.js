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
  const sheet = getSheetByName(SHEET_DEF.TIRELIRE.SHEET_NAME);
  const tirelireData = getSheetDataByName(SHEET_DEF.TIRELIRE.SHEET_NAME);

  console.log("Récupération de l'ID du calendrier de l'utilisateur");
  const calendar = CalendarApp.getDefaultCalendar();
  var rowIndex = 1;

  for (let row of tirelireData) {
    rowIndex++;
    const dateRetrait = row[getColumnIndex("TIRELIRE", "DATE_RETRAIT")];
    const idEvent = row[getColumnIndex("TIRELIRE", "ID_EVENT")];

    if (dateRetrait || idEvent) {
      console.warn("dateRetrait : " + dateRetrait);
      console.warn("idEvent : " + idEvent);
      console.warn("Cette tirelire sera ignorée");
      continue;
    }

    const event = createCalendarEvent(
      sheet,
      rowIndex,
      calendar,
      row[getColumnIndex("TIRELIRE", "DATE_DEPOT")]
    );

    if (!event) {
      showAlert(
        "Impossible de créer l'événement pour le magasin " +
          row[getColumnIndex("TIRELIRE", "ID_MAGASIN")] +
          " a la date de dépôt du " +
          row[getColumnIndex("TIRELIRE", "DATE_DEPOT")] +
          " sur le calendrier."
      );
      return;
    } else {
      noRollbackSetValue(
        sheet.getRange(rowIndex, getRealColumnIndex("TIRELIRE", "ID_EVENT")),
        event.getId()
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
    activeCell.getColumn() !== SHEET_DEF.TIRELIRE.COLUMNS.ID_EVENT.INDEX ||
    !activeCell.getColumn()
  ) {
    console.error("La cellule sélectionnée n'est pas un id_event valide");
    showAlert("Veuillez sélectionner une cellule avec un id_event valide.");
    return false;
  }

  return true;
}
