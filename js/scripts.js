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
//let xmlHopitaux = new XML();

function listePatients() {
    $.ajax({
        type: "GET",
        //url: "http://localhost:80/hopitaux/donnees/hospitalisations.xml",
        //url: "http://192.168.0.197/hopitaux/donnees/hospitalisations.xml",
        url: "donnees/hospitalisations.xml",
        dataType: "xml",
        success: function(reponse) {
            xmlHopitaux = reponse;
            afficherPatients();
            //test1();
        },
        fail: function() {
            alert("Gros problème");
        }
    })
}

function test1() {
    let unPatient = xmlHopitaux.getElementsByTagName('patient');
    let tags = unPatient[0].getElementsByTagName('*');
    for (let i = 0; i < tags.length; i++) {
        alert(tags[i].nodeName + ' = ' + tags[i].firstChild.nodeValue);
    }
}

function afficherPatients() {

    let tabPatients = xmlHopitaux.getElementsByTagName('patient');
    let taille = tabPatients.length;
    let emplacement = document.getElementById('contenu');

    let tableau = document.createElement('table');
    let titre = document.createElement('caption');
    let head = document.createElement('thead');
    let en_tete = document.createElement('th');
    let body = document.createElement('tbody');

    let rangee = document.createElement('tr');
    let cellule = document.createElement('td');

    tableau.classList.add('striped');
    tableau.classList.add('responsive-table');

    titre.appendChild(document.createTextNode("Liste des patients"));
    tableau.appendChild(titre);

/*    for (let i = 0; i < tags.length; i++) {
        alert(tags[i].nodeName + ' = ' + tags[i].firstChild.nodeValue);
    }*/

    //let tabPatients = xmlHopitaux.getElementsByTagName('patient');

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

    document.getElementById('contenu').appendChild(tableau);

/*    // afficher l'en-tête du tableau
    for(let attribut of tabPatients[0]) {
        head.appendChild(document.createTextNode(attribut));
        rangee.appendChild(head);
    }
    body.appendChild(rangee);*/
}

/*
function afficherPatients() {
    var tabPatients = xmlHopitaux.getElementsByTagName('patient');
    var taille = tabPatients.length;

/!*<table class="striped responsive-table">
        <thead>
        <tr>
        <th>Name</th>
        <th>Item Name</th>
    <th>Item Price</th>
    </tr>
    </thead>*!/

    var rep = "<table border=1>";
    rep += "<caption>LISTE DES PATIENTS</caption>";
    rep += "<thead><tr><th>DOSSIER</th><th>NOM</th><th>PRÉNOM</th><th>ANNÉE</th><th>MOIS</th><th>JOUR</th><th>SEXE</th></tr></thead>";

    for(var i=0; i<taille; i++) {
        var unPatient = tabPatients[i];
        var dossier = unPatient.getElementsByTagName('dossier')[0].firstChild.nodeValue;
        var nom = unPatient.getElementsByTagName('nom')[0].firstChild.nodeValue;
        var prenom = unPatient.getElementsByTagName('prenom')[0].firstChild.nodeValue;
        var annee = unPatient.getElementsByTagName('naissance')[0].firstChild.nodeValue;
        var mois = unPatient.getElementsByTagName('naissance')[1].firstChild.nodeValue;
        var jour = unPatient.getElementsByTagName('naissance')[2].firstChild.nodeValue;
        var sexe = unPatient.getElementsByTagName('sexe')[0].firstChild.nodeValue;
        rep += "<tr><td>" + dossier + "</td><td>" + nom + "</td><td>" + prenom + "</td><td>"
            + annee + "</td><td>" + mois + "</td><td>" + jour + "</td><td>" + sexe + "</td></tr>";
    }

    rep += "</table>";
    document.getElementById('contenu').innerHTML = rep;
}
*/
