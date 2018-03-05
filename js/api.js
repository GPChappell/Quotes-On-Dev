/**
 * Retrieve a new random post on the home page.
 * AJAX get call fires on button click to retrieve random post via WP REST API.
 * Front page is updated without refresh via jQuery.
 * HistoryAPI is used to update page URL with each new quote.
 */
(function ($) {

  var lastPage = '';
  var postData;

  //Click event to retrieve new quote
  $('#new-quote-button').on('click', function (e) {
      e.preventDefault();

      //Store current URL to enable later backtracking
      lastPage.push = document.URL;

      //AJAX get random quote
      $.ajax({
      method: 'GET',
      url: api_vars.root_url + 'wp/v2/posts?filter[orderby]=rand&filter[posts_per_page]=1',
      success: function( response ) {

        postData = response[0];
        var url = api_vars.home_url + '/' + postData.slug + '/';

        //Update front page with new quote
        $('.entry-content p').replaceWith( postData.content.rendered );
        $('.entry-content .entry-meta .entry-title').html( '&mdash; '+postData.title.rendered );

        if( postData._qod_quote_source.length !== 0 && postData._qod_quote_source_url.length !== 0 ) {
          $('.entry-content .entry-meta .source').html( ', <a href="'+postData._qod_quote_source_url+'">'+ postData._qod_quote_source +'</a>' );
        }
        else if( postData._qod_quote_source.length !== 0 ) {
          $('.entry-content .entry-meta .source').html( ', '+ postData._qod_quote_source );
        }
        else {
          $('.entry-content .entry-meta .source').text( '' );
        }

        history.pushState(null, null, url);

      },
      error: function() {

        //Display error message
        $('.entry-content p').replaceWith( '</p>Sorry, new post could not be retrieve</p>' );
        $('.entry-content .entry-meta .entry-title').html( '' );
        $('.entry-content .entry-meta .source').html( '' );
      }
      });

      //Update URL when new quote is displayed
      window.onpopstate = function(e) {
        if (window.location.hash.indexOf('qm-overview') === 1) {
          return false;
        }
        else {
          window.location.replace(lastPage);
        }
      };
  });
})(jQuery);


/**
 * Submit new quote to database.
 * AJAX post sent to WP REST API endpoint to create new post
 */
(function ($) {

  $('#submit-quote-button').on('click', function (e) {
    e.preventDefault();

    var quoteAuthor =  $('#quote-author').val();
    var quoteContent = $('#quote-content').val();
    var quoteSource = $('#quote-source').val();
    var quoteSourceURL = $('#quote-source-url').val();

    var data = {
      status: 'pending',
      title: quoteAuthor,
      content: quoteContent,
      _qod_quote_source: quoteSource,
      _qod_quote_source_url: quoteSourceURL
    };

    $.ajax({
      method: 'post',
      url: api_vars.root_url + 'wp/v2/posts/',
      data: data,
      beforeSend: function (xhr) {
          xhr.setRequestHeader('X-WP-Nonce', api_vars.nonce);
      },
      success: function () {
        $('#quote-submission-form').hide('slow');
        $('.entry-title').after( '<p>'+api_vars.success+'</p>' );
      },
      error: function () {
        $('#quote-submission-form').hide('slow');
        $('.entry-title').after( '<p>'+api_vars.failure+'</p>' );
      }
    });
  });
})(jQuery);

/**
 * Register a Custom Rest endpoint
 * route: wp-json/redsprout/v1/votes
 */
// function redsprout_register_endpoints() {
// 	register_rest_route(
// 		'redsprout/v1',
// 		'/votes/',
// 		array(
// 			'methods'  => 'GET',
// 			'callback' => 'redsprout_add_vote',
// 		)
// 	);
// }

/**
 * Basic vote testing no authentication or validation
 * Test with postman, the id of the post and number
 * Check your postmeta table for stored values
 *
 * in postman use post request with Body and form-data
 * form-data will needs the id of the post e.g. id 42
 */
// function redsprout_add_vote( WP_REST_Request $request ) {
// 	$votes = intval( get_post_meta( $request->get_param( 'id' ), 'votes', true ) );
// 	// if false === (bool) checks if update is successful, not false
// 	if ( false === (bool) update_post_meta( $request->get_param( 'id' ), 'votes', $votes + 1 ) ) {
// 		return new WP_Error( 'vote_error', __( 'Unable to add vote', 'redsprout' ), $request->get_param( 'id' ) );
// 	}

// 	// if no errors, increment vote
// 	return $votes + 1;
// }