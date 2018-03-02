// (function($) {


    //Fetch a random quote post

//history API, History.pushState()

// Submit a new quote with the form using ajax


// })(jQuery);

(function ($) {

  var lastPage = '';
  var postData;

  $('#new-quote-button').on('click', function (e) {
      e.preventDefault();

      lastPage = document.URL;

      $.ajax({
      method: 'GET',
      url: api_vars.root_url + 'wp/v2/posts?filter[orderby]=rand&filter[posts_per_page]=1',
    })
    .done(function (response) {

      console.log(response);

      postData = response[0];
      // console.log(postData);
      var url = api_vars.home_url + '/' + postData.slug + '/';

      
      

      $('.entry-content p').replaceWith( postData.content.rendered );
      $('.entry-content .entry-meta .entry-title').replaceWith( '<h2 class="entry-title">&mdash; '+postData.title.rendered+'</h2>' );

      if( postData._qod_quote_source.length !== 0 && postData._qod_quote_source_url.length !== 0 ) {
        $('.entry-content .entry-meta .source').replaceWith( '<span class="source">, <a href="'+postData._qod_quote_source_url+'">'+ postData._qod_quote_source +'</a></span>' );
      }
      else if( postData._qod_quote_source.length !== 0 ) {
        $('.entry-content .entry-meta .source').replaceWith( '<span class="source">, '+ postData._qod_quote_source +'</span>' );
      }
      else {
        $('.entry-content .entry-meta .source').replaceWith( '<span class="source"></span>' );
      }

      history.pushState(null, null, url);

    }).fail( function() {
      console.log('fail');
    });

    // window.onpopstate = function(event) {
    //   if (window.location.hash.indexOf('qm-overview') === 1) {
    //     return false;
    //   }else {
    //     window.location.replace(lastPage);
    //   }
    // };

   

  });

  $(window).on('popstate', function() {
    console.log("popstate fired!");
    if (window.location.hash.indexOf('qm-overview') === 1) {
      return false;
    }else {
      window.location.replace(lastPage);
    }
  });

})(jQuery);