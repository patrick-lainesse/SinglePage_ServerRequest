/*
Patrick Lainesse
740302
IFT1142, Hiver 2020
*/

// pour initialiser les select??? renommer et déplacer dans le code
$(document).ready(function(){
    $('select').formSelect();
    $(".dropdown-content>li>span").css("color", "#660066");
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

/*function afficherTableau() {

    let tabPatients = xmlHopitaux.getElementsByTagName('patient');

    let container = document.createElement('div');
    let tableau = document.createElement('table');
    let head = document.createElement('thead');
    let body = document.createElement('tbody');

    tableau.classList.add('striped');
    tableau.classList.add('responsive-table');
    container.classList.add('container');


    // afficher l'en-tête du tableau
    //var colonne = tabPatients[0].getElementsByTagName('*');
    for(let colonne of tabPatients[0].getElementsByTagName('*')) {
        let en_tete = document.createElement('th');
        let attribut = majuscule(colonne.nodeName);
        en_tete.appendChild(document.createTextNode(attribut));
        head.appendChild(en_tete);
    }
    tableau.appendChild(head);

    for(let i=0; i<tabPatients.length; i++) {
        let patient = tabPatients[i];

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
}*/
