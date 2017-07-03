$(document).ready(function() {
  // Generate a URL that can be used to link tweets back to this page.
  // NOTE: on the codepen version of this page, I am using a hard-coded hostname. This is because using the location href on codepen does not usually give a stable URL.
  var thisURL = new URL(window.location.href);
  var qid = thisURL.searchParams.get("qid"); // get qid, if it exists.
  const codePenSlug = "GEWYKJ";
  if (thisURL.hostname == "s.codepen.io") {
    thisURL = new URL("https://codepen.io/jgh/full/" + codePenSlug);
  }

  // If the page has a search parameter for a quote, load that quote by ID and update page. 
  newQuote(qid);
  
  // Let's plug into our quote API! 
  // wait for the new quote button to be clicked
  $("#new-quote-btn").on('click', function(e) {
    e.preventDefault();
    newQuote();
  });
  
  // newQuote
  // This function is called when the page loads and when the new quote button is clicked. 
  function newQuote(qid) {
    // Use jQuery ajax function to get quote
    $.ajax({
      // if there is a qid, retrieve that quote directly
      url: qid ? ("https://quotesondesign.com/wp-json/posts/" + qid) : "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1",
      success: function(data) {
        // a request for a specific quote returns a single object, a random quote returns an array with a single element.
        var post = qid ? data : data.shift();
        $('#quote-text').html(post.content);
        $('#quote-source').html(post.title);
        // build URL that comes back here
        thisURL.search = "qid=" + post.ID;
        // update tweet-btn href to point to twitter url string
        $('#tweet-a').attr("href", buildTweetURL(post.content, post.title, thisURL.href));
      },
      cache: false,
      error: function(jqXHR, textStatus, errorThrown) {
        $('#quote-text').html(textStatus + ": " + errorThrown);
        console.log(jqXHR.status);
        console.log(jqXHR.statusText);
      }
    });
  }
  
  // Tweet url helper function
  function buildTweetURL(text, title, url) {
    const intent = "https://twitter.com/intent/tweet?";
    // Strip html tags with jQuery 
    text = $(text).text();

    // Trim text to fit into a tweet.
    // hard coded numbers account for twitter's tweet length, characters used for a URL, and fluff like spaces, elipses, etc.
    if ((text.length + title.length + 29) > 140) {
      text = text.slice(0, 140-title.length-32);
      text = text.concat("...");
    }
    
    var tweetParams = {
      text: '"' + text + '" - ' + title,
      url: url,
      related: "eejonathan"
    }
    
    return (intent + $.param(tweetParams)) 
  }
});