function getUserDetails(email, frereData) {
    for (var i = 1; i < frereData.length; i++) {
        if (frereData[i][2] == email) {
            console.log("frereData " + frereData);
            console.log("Le frère " + email + " existe dans la liste des utilisateurs");
            return {
                nom: frereData[i][0],
                prenom: frereData[i][1],
                admin: frereData[i][4] === 'Administrateur'
            };
        }
    }
    console.log("Le frère " + email + " n'existe pas dans la liste des utilisateurs");
    return null;
}
