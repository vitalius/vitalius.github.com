var App = angular.module('ecstaticApp', ['ngDisqus']);

App.config(['$routeProvider', '$locationProvider', '$disqusProvider', 
                function($routeProvider, $locationProvider, $disqusProvider) {
                
    $locationProvider.hashPrefix('!');
    $disqusProvider.setShortname('vitaliy-blog');
    
    $routeProvider
        .when('/', { templateUrl: 'list.html', controller: 'IndexCtrl' })
        .when('/post/:postFileName', { templateUrl: 'post.html', controller: 'PostCtrl' })
        .otherwise( { redirectTo: '/' } );
}]);


/*
 * Config service
 */
App.factory('Config', function($http) {  

    CONFIG_FILE = 'config.json';
  
    var Config = function(c) { angular.extend(this, c); };
    
    Config.get = function() {
        return $http.get(CONFIG_FILE).then(function(res) {
            if (!res.data.about) return null;
                
            return new Config(res.data);
        },
        function(err) {
            return err.data;
        });
    };    
    return Config;
});


/*
 * Post 
 */
App.factory('Post', function($http, $q, Index) {    

    var CONTENT_DIR = 'content/';

    var Post = function(index, body) { 
        angular.extend(this, index, body); 
    };
    
    replaceLineBreaks = function(data) {    
        var JSON_START = /^\s*(\[|\{[^\{])/, 
            JSON_END = /[\}\]]\s*$/, 
            PROTECTION_PREFIX = /^\)\]\}',?\n/;
        
        data = data.replace(PROTECTION_PREFIX, '');
        
        // +diff from Angular's default transformResponse
        data = data.replace(/(\r\n|\n|\r)/gm, ' '); // get rid of \n
        data = data.replace(/\t/gm, '    ');        // get rid of tabs
        
        if (JSON_START.test(data) && JSON_END.test(data))
            data = JSON.parse(data);

        return data;
    }
    
    Post.body = function(filename) {    
        return $http.get(CONTENT_DIR + filename, { transformResponse: replaceLineBreaks }) 
                    .then(function(res) {
                    
            if (!(res.data.body)) return Post.fail("Invalid JSON", filename);

            return res.data;
        },
        function(err) {
            return Post.fail(err.data, filename);
        });
    };

    Post.fail = function(msg, filename) {
        if( typeof(msg) ==='undefined' ) 
            msg = 'Error';
            
        Post.error = msg;
        
        if( !(typeof(filename) ==='undefined') )
            Post.error +=" (" + filename + ")";
            
        return Post;
    };
    
    Post.get = function(filename) {
        return $q.all([ Index.query(), Post.body(filename) ]).then(function(res) {
            if (!res[0] || !res[0].dict)
                return Post.fail("Invalid JSON in index file");
            if (!res[1] || !res[1].body)
                return Post;
                
            return new Post(res[0].dict[filename], res[1]);
        },
        function(err) {
            return Post.fail(err.data);
        });        
    };
    
    return Post;
});

App.controller('PostCtrl', function($scope, $routeParams, $timeout, $window, Post) {

    $scope.post = Post.get($routeParams.postFileName);
    $window.disqus_shortname = $routeParams.postFileName;

    // meh fix for MathJax
    $timeout( function() { 
        MathJax.Hub.Config({
            tex2jax: {
                inlineMath: [ ['$','$'], ['\\(','\\)'] ],
                displayMath: [ ['$$','$$'], ['\\[','\\]'] ],
                processEscapes: true
            }
        });    
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementById("ecstatic_post_body")]); 
    }, 3000);
});


/*
 * Index
 */
App.factory('Index', function($http, $q, Config) {    

    var INDEX_FILE = 'content/index.json';

    var Index = function(l, d) { angular.extend(this, {"list":l}, {"dict":d}); };
    
    Index.fail = function(msg) {     
        if( typeof(msg) ==='undefined' ) 
            msg = 'Invalid JSON in index file';
        Index.error = msg;
        return Index; 
    };
    
    Index.query = function() {
        return $http.get(INDEX_FILE).then(function(res) {  
        
            if (!res.data) return Index.fail();
            
            var list = []
            
            angular.forEach(Object.keys(res.data), function(i) {
                if (!res.data[i].title || !res.data[i].date) 
                    return; // skip this item in the loop
                
                res.data[i].date = new Date(res.data[i].date);
                
                list.push({'filename':i, 'title':res.data[i].title,
                           'date':res.data[i].date, 'author':res.data[i].author});
            });            
            
            return new Index(list, res.data);
        },  
        function(err) {
            return Index.fail(err.data);
        });
    };
    
    Index.get = function() {
        return $q.all([ Index.query(), Config.get() ]).then(function(res) {

            if (res[0].error)
                return Index.fail("Invalid JSON in index file");
                
            if (res[1] && res[1].about) 
                res[0].about = res[1].about
                
            return res[0];
        },
        function(err) {
            return Index.fail(err.data);
        });        
    };       
    
    return Index;
});


App.controller('IndexCtrl', function($scope, Index) {
    $scope.index = Index.get();
    
    $scope.IsNew = function(d) {
        var daysOld = 3;
        return (new Date()).getTime() - (daysOld * 24 * 60 * 60 * 1000) < d.getTime();
    };
});
