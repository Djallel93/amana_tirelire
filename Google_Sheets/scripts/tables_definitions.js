const SHEET_DEF = {
  FRERE: {
    SHEET_NAME: "frere",
    COLUMNS: {
      NOM: { INDEX: 1, TYPE: "string" },
      PRENOM: { INDEX: 2, TYPE: "string" },
      MAIL: { INDEX: 3, TYPE: "string" },
      TELEPHONE: { INDEX: 4, TYPE: "string" },
      ROLE: { INDEX: 5, TYPE: "string" },
    },
  },
  MAGASIN: {
    SHEET_NAME: "magasin",
    COLUMNS: {
      ID: { INDEX: 1, TYPE: "number" },
      NOM: { INDEX: 2, TYPE: "string" },
      ADRESSE: { INDEX: 3, TYPE: "string" },
      QUARTIER: { INDEX: 4, TYPE: "string" },
      CODE_POSTAL: { INDEX: 5, TYPE: "number" },
      VILLE: { INDEX: 6, TYPE: "string" },
      TYPE: { INDEX: 7, TYPE: "string" },
      DELAIS_RECUPERATION: { INDEX: 8, TYPE: "number" },
      TELEPHONE: { INDEX: 9, TYPE: "string" },
      QR_CODE: { INDEX: 10, TYPE: "string" }, // image
    },
  },
  TIRELIRE: {
    SHEET_NAME: "tirelire",
    COLUMNS: {
      MAGASIN: { INDEX: 1, TYPE: "string" },
      DATE_DEPOT: { INDEX: 2, TYPE: "date" },
      DATE_RETRAIT: { INDEX: 3, TYPE: "date" },
      MONTANT: { INDEX: 4, TYPE: "number" },
      RECUPERE: { INDEX: 5, TYPE: "boolean" },
      PERDU: { INDEX: 6, TYPE: "boolean" },
      RESPONSABLE: { INDEX: 7, TYPE: "string" },
      NOTE: { INDEX: 8, TYPE: "number" },
      COMMENTAIRE: { INDEX: 9, TYPE: "string" },
      ID_EVENT: { INDEX: 10, TYPE: "string" },
    },
  },
  QUESTIONS_FORM: {
    HORODATEUR: "Horodateur",
    EMAIL: "Adresse e-mail",
    PASSWORD: "Veuillez saisir le mot de passe",
    ACTION: "Que voulez vous faire ?",
    ID_MAGASIN: "Quel est l'ID de votre magasin ?",
    RECUPEREE: "Avez vous réussi a récupérer la tirelire",
    PERDUE_VOLEE: "La tirelire a-t-elle était perdue/volée ?",
    REPROGRAMMER:
      "Souhaitez vous reprogrammer la récupération de votre tirelire ?",
    TRANSFERER: "Souhaitez vous transférer la tirelire a un autre frère ?",
    FRERE_SELECTIONNE: "Voici la liste des frères disponibles",
    DATE_REPROGRAMMATION: "Pour quand voulez vous reprogrammer votre passage ?",
    NOTE_RECUP: "Comment s'est passé la récupération de la tirelire",
    COMM_RECUP: "Laisser un commentaire ?",
  },
};

const SHEET_QUESTIONS_FORM = {
  HORODATEUR: "Horodateur",
  RECUPEREE: "Avez vous réussi a récupérer la tirelire",
  PERDUE_VOLEE: "La tirelire a-t-elle était perdue/volée ?",
  REPROGRAMMER:
    "Souhaitez vous reprogrammer la récupération de votre tirelire ?",
  TRANSFERER: "Souhaitez vous transférer la tirelire a un autre frère ?",
  FRERE_SELECTIONNE: "Voici la liste des frères disponibles",
  DATE_REPROGRAMMATION: "Pour quand voulez vous reprogrammer votre passage ?",
  CONTENU_CONNU: "Savez vous combien contenait la tirelire ?",
  MONTANT_RECUPERE: "Veuillez saisir le montant récupéré",
  EMAIL: "Adresse e-mail",
  ID_EVENT: "Quel est l'ID de l'évènement sur Google Calendar ?",
  NOTE_RECUP: "Comment s'est passé la récupération de la tirelire",
  COMM_RECUP: "Laisser un commentaire ?",
};

function getSheetByName(sheetName) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName.trim());
}

function getSheetDataByName(sheetName) {
  return getSheetByName(sheetName).getDataRange().getValues().slice(1);
}

function getSheetDataByID(sheetID, sheetName) {
  const sheet = SpreadsheetApp.openById(sheetID).getSheetByName(
    sheetName.trim()
  );
  return sheet.getDataRange().getValues().slice(1);
}

function getColumnIndex(sheetName, columnName) {
  return getRealColumnIndex(sheetName, columnName) - 1;
}

function getRealColumnIndex(sheetName, columnName) {
  return SHEET_DEF[sheetName.trim()].COLUMNS[columnName.trim()].INDEX;
}

function getColumnType(sheetName, columnName) {
  return SHEET_DEF[sheetName.trim()].COLUMNS[columnName.trim()].TYPE;
}

function getFormQuestion(namedValues, question) {
  return namedValues[question][0];
}
