function getMagasinDetails (nom, magasinData) {
  for (let i = 1; i < magasinData.length; i++) {
    if (magasinData[i][MAGASIN_DEF.NOM - 1] == nom) {
      console.log('Le magasin ' + nom + ' existe dans la feuille magasin')
      return {
        nom: magasinData[i][MAGASIN_DEF.NOM - 1],
        adresse: magasinData[i][MAGASIN_DEF.ADRESSE - 1],
        codePostal: magasinData[i][MAGASIN_DEF.CODE_POSTAL - 1],
        ville: magasinData[i][MAGASIN_DEF.VILLE - 1],
        delaisRecuperation: magasinData[i][MAGASIN_DEF.DELAISRECUPERATION - 1],
        telephone: magasinData[i][MAGASIN_DEF.TELEPHONE - 1]
      }
    }
  }
  console.log('Le magasin ' + nom + ' n\'existe pas dans la feuille magasin')
  return null
}
