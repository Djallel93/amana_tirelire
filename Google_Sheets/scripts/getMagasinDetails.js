function getMagasinDetails(nom, magasinData) {
  for (var i = 1; i < magasinData.length; i++) {
    if (magasinData[i][MAGASIN_COLUMNS.NOM - 1] == nom) {
      console.log("Le magasin " + nom + " existe dans la feuille magasin");
      return {
        nom: magasinData[i][MAGASIN_COLUMNS.NOM - 1],
        adresse: magasinData[i][MAGASIN_COLUMNS.ADRESSE - 1],
        codePostal: magasinData[i][MAGASIN_COLUMNS.CODE_POSTAL - 1],
        ville: magasinData[i][MAGASIN_COLUMNS.VILLE - 1],
        delaisRecuperation: magasinData[i][MAGASIN_COLUMNS.DELAISRECUPERATION - 1],
        telephone: magasinData[i][MAGASIN_COLUMNS.TELEPHONE - 1],
      };
    }
  }
  console.log("Le magasin " + nom + " n'existe pas dans la feuille magasin");
  return null;
}
