/*
strings.js

Ensemble des fonctions javascript qui effectuent des manipulations sur les String pour faciliter
la transformation des textes des tableaux XML en texte affiché à l'écran
*/

// Afficher un message d'erreur
const erreur = () => alert("Dû à des effectifs réduits en cette période de pandémie, l'option sélectionnée n'a pu s'afficher correctement.");

// Pour mettre la première lettre d'un mot en majuscule
const majuscule = mot => mot.charAt(0).toUpperCase() + mot.slice(1);

/* ==============================================================================================
                              MISE EN FORME DU TABLEAU XML
============================================================================================== */

const corrigerTableau = (tag, cle) => {

    let tableauXML;
    var texte = "";
    /*

    for(let i=0; i<tableauXML.length; i++) {
        let objet = tableauXML[i];

        if(objet.getElementsByTagName('dossier')[0].firstChild.nodeValue == dossier) {
            texte = objet.getElementsByTagName('dossier')[0].firstChild.nodeValue + " (" + objet.getElementsByTagName('prénom')[0].firstChild.nodeValue
                + " " + objet.getElementsByTagName('nom')[0].firstChild.nodeValue + ")";
        }
    }

    return texte;*/

    switch (tag) {
        case "naissance":
            break;
        case "adresse":
            tableauXML = xmlHopitaux.getElementsByTagName('hopital');

            for(let i=0; i<tableauXML.length; i++) {
                let objet = tableauXML[i];

                if (objet.getElementsByTagName('établissement')[0].firstChild.nodeValue == cle) {
                    let adresse = objet.getElementsByTagName('adresse')[0];
                    let tags = adresse.getElementsByTagName('*');
                    for(let i=0; i<tags.length-1; i++) {
                        texte += tags[i].firstChild.nodeValue + ", ";
                    }
                    texte += tags[tags.length-1].firstChild.nodeValue;
                }
            }
            break;
        default: texte = "défaut";

    }
    return texte;

};

/* ==============================================================================================
                                    MENU SELECT
============================================================================================== */

// Fonction qui retourne le texte des options du menu select en format: 4 (Patrick Lainesse)
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

// Fonction qui retourne le texte des options du menu select en format: 1234 - Centre hospitalier Sud
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
