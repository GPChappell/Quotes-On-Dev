// (function($) {


    //Fetch a random quote post

//history API, History.pushState()

// Submit a new quote with the form using ajax


// })(jQuery);

(function ($) {

  $('#new-quote-button').on('click', function (e) {
      e.preventDefault();

      $.ajax({
      method: 'GET',
      url: api_vars.root_url + 'wp/v2/posts?filter[orderby]=rand&filter[posts_per_page]=1',
    })
    .done(function (response) {
      console.log( response );
      var postData = response[0];
      $('.home .entry-content p').replaceWith( postData.content.rendered );
      $('.home .entry-content .entry-meta .entry-title').replaceWith( '<h2 class="entry-title">&mdash; '+postData.title.rendered+'</h2>' );

      if( postData._qod_quote_source.length !== 0 && postData._qod_quote_source_url.length !== 0 ) {
        $('.home .entry-content .entry-meta .source').replaceWith( '<span class="source">, <a href="'+postData._qod_quote_source_url+'">'+ postData._qod_quote_source +'</a></span>' );
        console.log('source & url');
      }
      else if( postData._qod_quote_source.length !== 0 ) {
        $('.home .entry-content .entry-meta .source').replaceWith( '<span class="source">, '+ postData._qod_quote_source +'</span>' );
        console.log('source & url');
      }
      else {
        $('.home .entry-content .entry-meta .source').replaceWith( '<span class="source"></span>' );
      }


      console.log(postData._qod_quote_source);
      console.log(postData._qod_quote_source.length);      
      console.log(postData._qod_quote_source_url);
      console.log(postData._qod_quote_source_url.length);           
      console.log(postData);
    }).fail( function() {
      console.log('fail');
    }
    );
  });
})(jQuery);