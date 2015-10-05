var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};	


// the entire framework right here!
$.getJSON("content/index.json", function(post_list) { 
    var post_file = getUrlParameter("p"); 
    if (post_file) {
	      // render a post
      $("#content").load("post.html", function() {
  		  $("#post_title").append(post_list[post_file].title);
		  $("#post_date").append(post_list[post_file].date); 
		  $("#post_body").load("content/" + post_file, function( response, status, xhr ) {
			    if ( status == "error" ) {
			      var msg = "Sorry but there was an error: ";
			      $( "#post_body" ).html( msg + xhr.status + " " + xhr.statusText );
			    }
				else {			  
				  // run MathJax and code highlight processors
			      $('pre code').each(function(i, block) { hljs.highlightBlock(block); });
	              MathJax.Hub.Config({
	                 tex2jax: {
	                    inlineMath: [ ['$','$'], ['\\(','\\)'] ],
	                    displayMath: [ ['$$','$$'], ['\\[','\\]'] ],
						processEscapes: true } });  
			      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
			    }				
	         });
      });
    } else {
      // render post index
      $("#content").load("list.html", function() {
	      $.each(post_list, function(k,v) { $("#post_list").append(
                "<li class=\"list-group-item\"><a href=\"?p=" + k + "\">" + v.title +"</a>" +
                "  <span class=\"pull-right\">" + v.date + "</span>" +
                "</li>")
		  });
      });
    }
});

