function getUserDetails(email, frereData) {
    for (var i = 1; i < frereData.length; i++) {
        if (frereData[i][2] == email) {
            console.log(
                "Le frère " + email + " existe dans la liste des utilisateurs"
            );
            return {
                nom: frereData[i][0],
                prenom: frereData[i][1],
                role: frereData[i][4],
            };
        }
    }
    console.log(
        "Le frère " + email + " n'existe pas dans la liste des utilisateurs"
    );
    return null;
}
