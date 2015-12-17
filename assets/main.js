/**
 * Cool colors
 */

var color = [  
    [62,35,255],
    [60,255,60],
    [255,35,98],
    [45,175,230],
    [255,0,255],
    [255,128,0]
];


/**
 * Route
 */
function routePage() {
    var page = RegExp('\\?\\w+\\.\\w+', 'i').exec(window.location)
    if (page) {
        return page[0].replace('?', '')
    }
}


/**
 * Render post file
 */
function renderPage(title, date, file) {
    
    $("#post_title").append(title);
    
    if (date)
        $("#post_date").append("Posted on " + date); 
    
    $("#post_body").load("content/" + file, function( response, status, xhr ) {
        if ( status == "error" ) {
           var msg = "Sorry but there was an error: ";
           $( "#post_body" ).html( msg + xhr.status + " " + xhr.statusText );
        } else {              
            /*
           MathJax.Hub.Config({ tex2jax: { inlineMath: [ ['$','$'], ['\\(','\\)'] ],
                                           displayMath: [ ['$$','$$'], ['\\[','\\]'] ],
                                           processEscapes: true } });  
           MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
           */
        }                
    });
}


/**
 * Add color zaz
 */
function mouseActive(o) {   
    var r = Math.floor(Math.random()*color.length);

    o.on('mouseover', function() { 
        o.attr("fill", "rgb(" + color[r] + ")" );
        o.attr("stroke-width", "3" );
        o.attr("stroke", "rgb(" + color[r] + ")" ); 
    });
    
    o.on('mouseout', function() { 
        o.attr("fill", "#000" );
        o.attr("stroke", "0" );  
    });  
}



/**
 * On load
 */
$.getJSON("content/index.json", function(post_list) {    
    var page_file = routePage();
    
    if (!page_file)
        page_file = Object.keys(post_list)[0]; // first item off the list
    
    $("#content").load("post.html", function() {
        renderPage(post_list[page_file].title, post_list[page_file].date, page_file);
    });    
    
    var i = Math.floor(Math.random() * (color.length - 1));    
    $("#header_bar").css("background", "-webkit-linear-gradient(left, rgb(" + color[i] + "), rgb(" + color[i + 1] + "))");
    $("#header_bar").css("background", "-o-linear-gradient(right, rgb(" + color[i] + "), rgb(" + color[i + 1] + "))");
    $("#header_bar").css("background", "-moz-linear-gradient(right, rgb(" + color[i] + "), rgb(" + color[i + 1] + "))");
    $("#header_bar").css("background", "linear-gradient(to right, rgb(" + color[i] + "), rgb(" + color[i + 1] + "))");

    /* logo colors */
    for(var i=0; i<9; i++)
        mouseActive($('#'+i));
});
