
// pour initialiser les select
/*document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, options);
});*/

// Or with jQuery

$(document).ready(function(){
    $('select').formSelect();
    $(".dropdown-content>li>span").css("color", "#660066");
    //$(".dropdown-content>li>span").css("background", "#006600");
    //????
});