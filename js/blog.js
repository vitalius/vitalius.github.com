/**
 * Get URL params
 */ 
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'), sParameterName, i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};    


/**
 * Render post file
 */
function renderPost(title, date, file) {
    
    $("#post_title").append(title);
    
    if (date)
        $("#post_date").append("Posted on " + date); 
    
    $("#post_body").load("content/" + file, function( response, status, xhr ) {
        if ( status == "error" ) {
           var msg = "Sorry but there was an error: ";
           $( "#post_body" ).html( msg + xhr.status + " " + xhr.statusText );
        } else {              
           MathJax.Hub.Config({ tex2jax: { inlineMath: [ ['$','$'], ['\\(','\\)'] ],
                                           displayMath: [ ['$$','$$'], ['\\[','\\]'] ],
                                           processEscapes: true } });  
           MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        }                
    });
}


/**
 * On load
 */
$.getJSON("content/index.json", function(post_list) { 
    
    var post_file = getUrlParameter("p"); 
    
    if (!post_file)
        post_file = Object.keys(post_list)[0];
    
    $("#content").load("post.html", function() {
        renderPost(post_list[post_file].title, post_list[post_file].date, post_file);
    });
    
    
    var color = [  
        [62,35,255],
        [60,255,60],
        [255,35,98],
        [45,175,230],
        [255,0,255],
        [255,128,0]
    ];
    var i = Math.floor(Math.random() * 5);    
    $("#header_bar").css("background", "-webkit-linear-gradient(left, rgb(" + color[i] + "), rgb(" + color[i + 1] + "))");
    $("#header_bar").css("background", "-o-linear-gradient(right, rgb(" + color[i] + "), rgb(" + color[i + 1] + "))");
    $("#header_bar").css("background", "-moz-linear-gradient(right, rgb(" + color[i] + "), rgb(" + color[i + 1] + "))");
    $("#header_bar").css("background", "linear-gradient(to right, rgb(" + color[i] + "), rgb(" + color[i + 1] + "))");
});
