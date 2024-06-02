const FRERE_DEF = {
    SHEET_NAME: "frere",
    NOM: 1,
    PRENOM: 2,
    MAIL: 3,
    TELEPHONE: 4,
    ROLE: 5
};

const MAGASIN_DEF = {
    SHEET_NAME: "magasin",
    NOM: 1,
    ADRESSE: 2,
    QUARTIER: 3,
    CODE_POSTAL: 4,
    VILLE: 5,
    TYPE: 6,
    DELAISRECUPERATION: 7,
    TELEPHONE: 8
};

const TIRELIRE_DEF = {
    SHEET_NAME: "tirelire",
    MAGASIN: 1,
    DATE_DEPOT: 2,
    DATE_RETRAIT: 3,
    MONTANT: 4,
    RECUPERE: 5,
    PERDU: 6,
    RESPONSABLE: 7,
    ID_EVENT: 8
};

const QUESTIONS_FORMULAIRE = {
    HORODATEUR: "Horodateur",
    RECUPEREE: "Avez vous réussi a récupérer la tirelire",
    PERDUE_VOLEE: "La tirelire a-t-elle était perdue/volée ?",
    REPROGRAMMER: "Souhaitez vous reprogrammer la récupération de votre tirelire ?",
    TRANSFERER: "Souhaitez vous transférer la tirelire a un autre frère ?",
    FRERE_SELECTIONNE: "Voici la liste des frères disponibles",
    DATE_REPROGRAMMATION: "Pour quand voulez vous reprogrammer votre passage ?",
    CONTENU_CONNU: "Savez vous combien contenait la tirelire ?",
    MONTANT_RECUPERE: "Veuillez saisir le montant récupéré",
    EMAIL: "Adresse e-mail",
    ID_EVENEMENT: "Quel est l'ID de l'évènement sur Google Calendar ?",
};
