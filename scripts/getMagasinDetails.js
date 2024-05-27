function getMagasinDetails(nom, magasinData) {
  for (var i = 1; i < magasinData.length; i++) {
    if (magasinData[i][0] == nom) {
      console.log("Le magasin " + nom + " existe dans la feuille magasin");
      return {
        nom: magasinData[i][0],
        adresse: magasinData[i][1],
        codePostal: magasinData[i][3],
        ville: magasinData[i][4],
        delaisRecuperation: magasinData[i][6],
      };
    }
  }
  console.log("Le magasin " + nom + " n'existe pas dans la feuille magasin");
  return null;
}
