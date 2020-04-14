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

    let contenu = document.getElementById('contenu');
    let row = document.createElement('div');
    let inputF = document.createElement('div');
    let menu = document.createElement('select');
    let tableauXML;

    row.classList.add('row');
    inputF.classList.add('input-field');
    inputF.classList.add('col');
    inputF.classList.add('s3');

    switch (identifiant) {
        case 'nom':
            menu.setAttribute('id', 'patient');
            menu.setAttribute('onChange', 'afficherTableau("patient")');
            tableauXML = xmlHopitaux.getElementsByTagName('patient');
            break;
    }

    for(let i=0; i<tableauXML.length; i++) {
        let objet = tableauXML[i];
        let option = document.createElement('option');
        option.setAttribute('id', objet.getElementsByTagName('dossier')[0].firstChild.nodeValue);
        // le texte des options sous le format: 4 (Patrick Lainesse) ??? rendu ici????
        let texte = objet.getElementsByTagName('dossier')[0].firstChild.nodeValue + " (" + objet.getElementsByTagName('prénom')[0].firstChild.nodeValue;
        option.appendChild(document.createTextNode(texte));
        menu.appendChild(option);
    }
    row.appendChild(inputF);
    inputF.appendChild(menu);

    // vider l'emplacement au cas où il y a déjà un tableau affiché
    while(contenu.firstChild) {
        contenu.removeChild(contenu.firstChild);
    }
    contenu.appendChild(row);

    //document.getElementById('contenu').appendChild(row);

/*<div class="row">
        <div class="input-field col s3">
        <select>
        <option value="" disabled selected>Choose your option</option>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
    </select>
    <label>Materialize Select</label>
    </div>
    </div>*/
}