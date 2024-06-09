const FRERE_DEF = {
  SHEET_NAME: "frere",
  NOM: { INDEX: 1, TYPE: "string" },
  PRENOM: { INDEX: 2, TYPE: "string" },
  MAIL: { INDEX: 3, TYPE: "string" },
  TELEPHONE: { INDEX: 4, TYPE: "string" },
  ROLE: { INDEX: 5, TYPE: "string" },
};

const MAGASIN_DEF = {
  SHEET_NAME: "magasin",
  NOM: { INDEX: 1, TYPE: "string" },
  ADRESSE: { INDEX: 2, TYPE: "string" },
  QUARTIER: { INDEX: 3, TYPE: "string" },
  CODE_POSTAL: { INDEX: 4, TYPE: "number" },
  VILLE: { INDEX: 5, TYPE: "string" },
  TYPE: { INDEX: 6, TYPE: "string" },
  DELAISRECUPERATION: { INDEX: 7, TYPE: "number" },
  TELEPHONE: { INDEX: 8, TYPE: "string" },
};

const TIRELIRE_DEF = {
  SHEET_NAME: "tirelire",
  MAGASIN: { INDEX: 1, TYPE: "string" },
  DATE_DEPOT: { INDEX: 2, TYPE: "date" },
  DATE_RETRAIT: { INDEX: 3, TYPE: "date" },
  MONTANT: { INDEX: 4, TYPE: "number" },
  RECUPERE: { INDEX: 5, TYPE: "boolean" },
  PERDU: { INDEX: 6, TYPE: "boolean" },
  RESPONSABLE: { INDEX: 7, TYPE: "string" },
  ID_EVENT: { INDEX: 8, TYPE: "string" },
};

const QUESTIONS_FORMULAIRE = {
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
  ID_EVENEMENT: "Quel est l'ID de l'évènement sur Google Calendar ?",
};
