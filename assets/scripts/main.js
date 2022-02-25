let searchInput = localStorage.getItem('searchInput') || '';
let searchResult = JSON.parse(localStorage.getItem('searchResult')) || {};
let pageUrl = window.location.search;
let parameters = new URLSearchParams(pageUrl);
let value = parameters.get('id');
let searchParam = parameters.get('search');
let loading = true;
$('#search').val(searchInput);

$(function () {

  const apiKey = 'd5b08408';

  function searchMovie() {
    $('#search').keypress(function (e) {
      let searchVal = $('#search').val();
      var url = "http://www.omdbapi.com/?apikey=" + apiKey;
      var key = e.which;
      if (key == 13) {
        let inputVal = $(this).val();
        
        $.ajax({
          method: "GET",
          url: url + "&s=" + searchVal,
          success: function (data) {
            if( data.Search && data.Search.length > 0) {
              createMovieList(data)
              localStorage.setItem('searchInput', inputVal);
              localStorage.setItem('searchResult', JSON.stringify(data));
            }else {
              $('#main').html(`<h3>No results</h3>`)
            }
          }
        })
      }
    });
  }

  function createMovieList(movieData) {
    $('#main').html("")
    $('.dont_title').remove();
    for (let i = 0; i < movieData.Search.length; i++) {
      if(movieData.Search[i].Poster != 'N/A'){
      
      let movieHtml = `
    <a href="/detail.html?id=${movieData.Search[i].imdbID}" class="movie_item_container">
      <img src="${movieData.Search[i].Poster}" class="lazy main_moive_photo" alt="">
      <span class="movie_year">${movieData.Search[i].Year}</span>
      <h3 class="movie_title">${movieData.Search[i].Title}</h3>
    </a>
    `
      $('#main').append(movieHtml);
    }
    }
  }

  function createMovieDetail(data) {
    $('.detail_banner_top').attr("src", `${data.Poster}`)
    $('.bottom_banner').attr("src", `${data.Poster}`)
    $('.movie_photo_slider_item').attr("src", `${data.Poster}`)
    $('.summary_paragraph').text(data.Plot);
    $('.detail_rating_movie').text(data.imdbRating + '/10');
    $('.movie_big_title').text(data.Title);
    $('.movie_box_infos').text(data.Genre);
    $('.blog_item_image').attr("src", `${data.Poster}`)
    $('.blog_title').text(data.Title);
  }

  function getDetails(movieId) {
    $.ajax({
      method: "GET",
      url: 'http://www.omdbapi.com/?i=' + movieId + '&apikey=' + apiKey,
      success: function (dataDetail) {
        createMovieDetail(dataDetail);
        loading = true;
      }
    })
  }

  if (searchParam === 'true'){
    createMovieList(searchResult);
    
    localStorage.removeItem('searchResult');
    localStorage.removeItem('searchInput');
  }

  getDetails(value);
  searchMovie();

  $('.detail_back_button').click(function(){
    window.location.href = 'index.html?search=true';
  })

  $('.lazy').Lazy();
  $('.search_icon').click(function () {
    $('#search').css("visibility", "visible");
    $('.search_close').css("visibility", "visible");
  });

  $('.search_close').click(function () {
    $('#search').css("visibility", "hidden");
    $(this).css("visibility", "hidden");
  });

  $('.show_more').on("click", function () {
    $(this).parent().find("div.summary").css("height", "auto");
    $(this).css("display", "none");
    $(this).parent().find("span.not_read").css("display", "block");
  })

  $('.not_read').on("click", function () {
    $(this).parent().find("div.summary").css("height", "120px");
    $(this).css("display", "none");
    $(this).parent().find("span.show_more").css("display", "block");
  })

  $('.detail_slider_photo').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
  });


});

$(window).on("load", function () {
  if(window.location.href.indexOf('/detail.html?id=tt') >= 0 && loading){
    $(".loader-wrapper").fadeOut();
  }
  else {
    setTimeout(() => {
      $(".loader-wrapper").fadeOut();
    }, 1300);
  }
});