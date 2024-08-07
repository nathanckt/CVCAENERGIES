var IndexReferences = new Swiper('.mySwiper', {
    effect: 'none',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 2.5,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  var swiper = new Swiper(".swiper-2", {
    slidesPerView: 3,
    centeredSlides: true,
    grabCursor: true,
    spaceBetween: 30,
    loop: true,
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
    // scrollbar: {
    //   el: ".swiper-scrollbar"
    // }
  });

  // QUI SOMMES-NOUS ? 

  var swiper = new Swiper(".dates-swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 3,
    coverflowEffect: {
        rotate: 20,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
    on: {
        slideChange: function () {
            updateSlideText(this.realIndex);
        },
    },
});

function updateSlideText(index) {
    // Hide all slide-text elements
    document.querySelectorAll('.slide-text').forEach(function(el) {
        el.style.display = 'none';
    });
    
    // Show the slide-text element corresponding to the centered slide
    var centeredSlide = swiper.slides[index];
    var slideId = centeredSlide.getAttribute('data-id');
    if (slideId) {
        var textElement = document.getElementById(slideId + '-text');
        if (textElement) {
            textElement.style.display = 'block';
        }
    }
}

// Initialize the first slide text as visible
updateSlideText(swiper.realIndex);
