/*
Patrick Lainesse
740302
IFT1142, Hiver 2020
*/

// pour initialiser les select??? renommer et déplacer dans le code
$(document).ready(function(){
    $('select').formSelect();
    $(".dropdown-content>li>span").css("color", "#660066");

    listePatients();
    //$(".dropdown-content>li>span").css("background", "#006600");
    //???? pour les select
});

let xmlHopitaux = null;

// mettre un argument à cette fonction????
function listePatients() {
    $.ajax({
        type: "GET",
        //url: "http://localhost:80/hopitaux/donnees/hospitalisations.xml",
        //url: "http://192.168.0.197/hopitaux/donnees/hospitalisations.xml",
        url: "donnees/hospitalisations.xml",
        dataType: "xml",
        success: function(reponse) {
            xmlHopitaux = reponse;
            afficherTableau("patient");
        },
        fail: function() {
            alert("Gros problème");
        }
    })
}

/* Fonction qui s'exécute quand on sélectionne une des quatre premières options (afficher patients, établissements,...).
Elle reçoit comme paramètre l'élément qui a été sélectionné, pour permettre de sélectionner
les bonnes informations à afficher. Le deuxième paramètre est le no de dossier du patient à afficher pour l'option
hospitalisations par patient. Le no de dossier est à 0 pour les trois premières options (afficher les tableaux JSON). */
//function afficherTableau(elem, dossier, codeEtab, spec) {
function afficherTableau(elem) {

    let tableauXML = xmlHopitaux.getElementsByTagName(elem);

    let container = document.createElement('div');
    let tableau = document.createElement('table');
    let head = document.createElement('thead');
    let body = document.createElement('tbody');

    tableau.classList.add('striped');
    tableau.classList.add('responsive-table');
    container.classList.add('container');



    // afficher l'en-tête du tableau
    for(let colonne of tableauXML[0].getElementsByTagName('*')) {
        let en_tete = document.createElement('th');
        let attribut = majuscule(colonne.nodeName);
        en_tete.appendChild(document.createTextNode(attribut));
        head.appendChild(en_tete);
    }
    tableau.appendChild(head);

    for(let i=0; i<tableauXML.length; i++) {
        let patient = tableauXML[i];

        let tr = document.createElement('tr');

        var tags = patient.getElementsByTagName('*');

        for(let j=0; j<tags.length; j++) {
            let attribut = tags[j].firstChild.nodeValue;

            let td = document.createElement('td');
            td.appendChild(document.createTextNode(attribut));
            tr.appendChild(td);
        }

        body.appendChild(tr);
    }
    tableau.appendChild(body);

    document.getElementById('contenu').appendChild(container);
    container.appendChild(tableau);
}

function charger_select(identifiant) {

    let menu = document.createElement('select');
    let tableauXML;

    styleCreerDivSelect();
    let divSelect = document.getElementById('divSelect');

    // créer un select selon l'option de la page qui a été sélectionnée
    switch (identifiant) {
        case 'patients':
            menu.setAttribute('id', 'patients');
            menu.setAttribute('onChange', 'afficherTableau("patient")');
            tableauXML = xmlHopitaux.getElementsByTagName('patient');
            break;
        case 'établissements':
            menu.setAttribute('id', 'établissements');
            menu.setAttribute('onChange', 'charger_select("spécialités")');
            tableauXML = xmlHopitaux.getElementsByTagName('hopital');
            break;
        case 'spécialités':
            menu.setAttribute('id', 'spécialités');
            menu.setAttribute('onChange', 'afficherTableau("spécialités")');
            tableauXML = xmlHopitaux.getElementsByTagName('hospitalisation');
            break;
    }

    // créer des options selon le menu select que l'on cherche à créer
    for(let i=0; i<tableauXML.length; i++) {
        let objet = tableauXML[i];
        let option = document.createElement('option');

        switch (identifiant) {
            case 'patients':
                let dossier = objet.getElementsByTagName('dossier')[0].firstChild.nodeValue;
                option.setAttribute('id', dossier);
                option.appendChild(document.createTextNode(texteOptionPatients(dossier)));
                menu.appendChild(option);
                break;
            case 'établissements':
                let etablissement = objet.getElementsByTagName('établissement')[0].firstChild.nodeValue;
                option.setAttribute('id', etablissement);
                option.appendChild(document.createTextNode(texteOptionHopital(etablissement)));
                menu.appendChild(option);
                break;
            case 'spécialités':
                let specialite = objet.getElementsByTagName('spécialité')[0].firstChild.nodeValue;
                option.setAttribute('id', specialite);
                option.appendChild(document.createTextNode(majuscule(specialite)));
                menu.appendChild(option);
                break;
            default:
                alert("Dû à des effectifs réduits en cette période de pandémie, l'option sélectionnée n'a pu s'afficher correctement.");
                location.reload();
                break;
        }
    }
/*
    // vider l'emplacement au cas où il y a déjà un tableau affiché ???? il faut préalablement récupérer le select s'il y en a un, donc ID pour ce select ????
    while(contenu.firstChild) {
        contenu.removeChild(contenu.firstChild);
    }*/

    // ajouter les éléments au DOM de la page
    divSelect.appendChild(menu);
    styleSelect();
}
