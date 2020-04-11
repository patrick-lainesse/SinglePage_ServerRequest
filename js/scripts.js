/*
Patrick Lainesse
740302
IFT1142, Hiver 2020
*/

// pour initialiser les select
$(document).ready(function(){
    $('select').formSelect();
    $(".dropdown-content>li>span").css("color", "#660066");
    //$(".dropdown-content>li>span").css("background", "#006600");
    //???? pour les select
});

var xmlHopitaux = null;

function afficherPatients() {
    var tabPatients = xmlHopitaux.getElementsByTagName('patient');
    var taille = tabPatients.length;

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

function listePatients(){

    $.ajax({
        type: "GET",
        //url: "http://localhost:80/hopitaux/donnees/hospitalisations.xml",
        //url: "http://192.168.0.197/hopitaux/donnees/hospitalisations.xml",
        url: "donnees/hospitalisations.xml",
        dataType: "xml",
        success: function(reponse) {
            xmlHopitaux = reponse;
            afficherPatients();
        },
        fail: function() {
            alert("Gros problème");
        }
    })
}