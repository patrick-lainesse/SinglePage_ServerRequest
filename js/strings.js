/*
strings.js

Ensemble des fonctions javascript qui effectuent des manipulations sur les String pour faciliter
la transformation des textes des tableaux XML en texte affiché à l'écran
*/

// Pour mettre la première lettre d'un mot en majuscule
const majuscule = mot => mot.charAt(0).toUpperCase() + mot.slice(1);


/* ==============================================================================================
                                    MENU SELECT
============================================================================================== */

// fonction qui retourne le texte des options du menu select en format: 4 (Patrick Lainesse)
const texteOptionPatients = dossier => {

    let tableauXML = xmlHopitaux.getElementsByTagName('patient');
    var texte;

    for(let i=0; i<tableauXML.length; i++) {
        let objet = tableauXML[i];

        if(objet.getElementsByTagName('dossier')[0].firstChild.nodeValue == dossier) {
            texte = objet.getElementsByTagName('dossier')[0].firstChild.nodeValue + " (" + objet.getElementsByTagName('prénom')[0].firstChild.nodeValue
            + " " + objet.getElementsByTagName('nom')[0].firstChild.nodeValue + ")";
        }
    }

    return texte;
};

// fonction qui retourne le texte des options du menu select en format: 1234 - Centre hospitalier Sud
const texteOptionHopital = codeEtablissement => {

    let tableauXML = xmlHopitaux.getElementsByTagName('hopital');
    var texte;

    for(let i=0; i<tableauXML.length; i++) {
        let objet = tableauXML[i];

        if(objet.getElementsByTagName('établissement')[0].firstChild.nodeValue == codeEtablissement) {
            texte = objet.getElementsByTagName('établissement')[0].firstChild.nodeValue + " - " + objet.getElementsByTagName('nom')[0].firstChild.nodeValue;
        }
    }

    return texte;
};
