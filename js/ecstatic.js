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

var post_list;
$.getJSON("content/index.json", function(d) { 
  post_list = d; 
   
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
			      $('pre code').each(function(i, block) { hljs.highlightBlock(block); });
	              MathJax.Hub.Config({
	                 tex2jax: {
	                    inlineMath: [ ['$','$'], ['\\(','\\)'] ],
	                    displayMath: [ ['$$','$$'], ['\\[','\\]'] ],
						processEscapes: true } });  
			      MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
			    }				
	         });
			 
		     /* * * CONFIGURATION VARIABLES * * */
		     var disqus_shortname = 'vitaliy-blog';
  
		     /* * * DON'T EDIT BELOW THIS LINE * * */
		     (function() {
		         var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
		         dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
		         (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
		     })();
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

