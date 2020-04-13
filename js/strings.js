// Pour mettre la première lettre d'un mot en majuscule
const majuscule = mot => mot.charAt(0).toUpperCase() + mot.slice(1);

// le texte des options sous le format: 4 (Patrick Lainesse)
const optionPatient = dossier => {
    let patients = xmlHopitaux.getElementsByTagName('patient');
    let option = document.createElement('option');

};
