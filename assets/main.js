/**
 * Route
 */
function routePage() {
    var page = RegExp('\\?\\w+\\.\\w+', 'i').exec(window.location)
    if (page)
        return page[0].replace('?', '');
}


/**
 * Render post file
 */
function renderPage(title, date, file) {  
    $("#post_title").append(title);
    
    if (date)
        $("#post_date").append("Posted on " + date); 
    
    $("#post_body").load("content/" + file, function( response, status, xhr ) {
        if ( status == "error" )
           $( "#post_body" ).html( "Sorry but there was an error: " + xhr.status + " " + xhr.statusText );           
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
});



/**
 * I like these colors
 */
var color = [  
    [62,35,255],
    [60,255,60],
    [255,35,98],
    [45,175,230],
    [255,0,255],
    [255,128,0]
];

var c = Math.floor(Math.random() * (color.length - 1));

$("#header_bar").css("background", "-webkit-linear-gradient(left, rgb(" + color[c] + "), rgb(" + color[c + 1] + "))");
$("#header_bar").css("background", "-o-linear-gradient(right, rgb(" + color[c] + "), rgb(" + color[c + 1] + "))");
$("#header_bar").css("background", "-moz-linear-gradient(right, rgb(" + color[c] + "), rgb(" + color[c + 1] + "))");
$("#header_bar").css("background", "linear-gradient(to right, rgb(" + color[c] + "), rgb(" + color[c + 1] + "))");
