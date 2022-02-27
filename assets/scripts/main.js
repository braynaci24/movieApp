let searchInput = localStorage.getItem('searchInput') || '';
let searchResult = JSON.parse(localStorage.getItem('searchResult')) || {};
let fav = JSON.parse(localStorage.getItem('fav')) || {
  Search: []
};
let pageUrl = window.location.search;
let parameters = new URLSearchParams(pageUrl);
let value = parameters.get('id');
let searchParam = parameters.get('search');
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
            if (data.Search && data.Search.length > 0) {
              createMovieList(data)
              localStorage.setItem('searchInput', inputVal);
              localStorage.setItem('searchResult', JSON.stringify(data));
            } else {
              $('#main').html(`<h3>No results</h3>`)
            }
          }
        })
      }
    });
  }


  function createMovieList(movieData) {
    if (movieData.Search.length < 1) {
      return
    }
    $('#main').html("")
    for (let i = 0; i < movieData.Search.length; i++) {
      if (movieData.Search[i].Poster != 'N/A') {

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

  let favItem = undefined

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

    for (let i = 0; i < fav.Search.length; i++) {
      if (fav.Search[i].imdbID == data.imdbID) {
        $('.favorites').toggleClass('far').toggleClass('fas star');
      }
    }
  }

  function getDetails(movieId) {
    $.ajax({
      method: "GET",
      url: 'http://www.omdbapi.com/?i=' + movieId + '&apikey=' + apiKey,
      success: function (dataDetail) {
        favItem = {
          Title: dataDetail.Title,
          Poster: dataDetail.Poster,
          Type: dataDetail.Type,
          Year: dataDetail.Year,
          imdbID: dataDetail.imdbID
        }
        createMovieDetail(dataDetail);
      }
    })
  }

  function addToList(data) {
    fav.Search.push(data);
    localStorage.setItem('fav', JSON.stringify(fav));
  }

  getDetails(value);
  searchMovie();

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

  createMovieList(fav);

  if ($('.detail_slider_photo').length > 0) {
    $('.detail_slider_photo').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
    });
  }

  $('.favorites').click(function () {
    if ($(this).hasClass('fas')) {
      let filteredFavorites = fav.Search.filter(function (item) {
        if (item.imdbID != value) {
          return item
        }
      })

      fav.Search = filteredFavorites;
      localStorage.setItem('fav', JSON.stringify(fav));
    } else {
      addToList(favItem);
    }
    $(this).toggleClass('far').toggleClass('fas star');
  });

});



$(window).on("load", function () {
  setTimeout(() => {
    $(".loader-wrapper").fadeOut();
  }, 1300);
});