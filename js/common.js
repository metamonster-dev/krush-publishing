$(document).ready(function () {
  localStorageInit();
  // Swiper Slide
  const swiper1 = new Swiper("#slider01", {
    slidesPerView: 1.6,
    centeredSlides: true,
    loop: true,
    touchRatio: 0,
    allowTouchMove: false,
    observer: true,
    observeParents: true,
    navigation: {
      nextEl: "#slider01 .next_btn",
      prevEl: "#slider01 .prev_btn",
    },
  });

  const swiper2 = new Swiper("#slider02", {
    slidesPerView: 1.5,
    spaceBetween: 50,
    centeredSlides: true,
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    breakpoints: {
      767: {
        spaceBetween: 130,
      },
    },
  });

  // AOS
  AOS.init();

  // KAKAO
  Kakao.cleanup();
  Kakao.init("2acfc4576e78cb295c47df69625db60b");
  // console.log(Kakao.isInitialized());
});

$(window).on("load", function () {
  pageInit();
});

const localStorageInit = () => {
  // 방문 여부 체크, 운세보기 누른 수 체크, 운세값 결과 체크, 공유하기 클릭 수, 다시하기 수
  if (localStorage.getItem("visit") === "1") {
    // 이미 방문했다
  } else {
    // 처음 방문
    localStorage.setItem("visit", "1");
    sendApi({
      "key":"visit",
      "value":1
    })
  }
}

// const siteUrl = "https://metamonster-dev.github.io/krush-publishing";
const siteUrl = "http://beerkrushcap.com";

function pageInit() {
  const paramsCap = getParams()?.cap;

  if (paramsCap) {
    const divOffset =
      $(".section08").offset().top + $(".section08").outerHeight() - 20;

    $("html, body").animate({ scrollTop: divOffset }, 400);
    $(".step_section#step02").removeClass("d-none");
    $(".step_section#step01").addClass("d-none");
    showFortune(paramsCap);
  } else {
    $(".step_section#step01").removeClass("d-none");
    $(".step_section#step02").addClass("d-none");
  }
}

function showFortune(paramsCap) {
  // Hide all fortunes
  document.querySelectorAll('.fortune1, .fortune2, .fortune3 .fortune4 .fortune5 .fortune6 .fortune7 .fortune8').forEach(function(fortune) {
      fortune.classList.add('d-none');
  });
  // Show the fortune based on paramsCap
  if (paramsCap) {
      document.querySelector(`.fortune${paramsCap}`).classList.remove('d-none');
  }
}

// STEP show / hide
function onStepActive(step) {
  $(".step_section").addClass("d-none");
  $(`.step_section#${step}`).removeClass("d-none");
  $(".step_section .sec02_type02 .img_area").removeClass("on").addClass("on");
}

// Modal show / hide
function onModalShow() {
  $(".modal_wrap").addClass("show");
}
function onModalHide() {
  $(".modal_wrap").removeClass("show");
}

// GET Params
function getParams() {
  let params = {};
  const regex = /[?&]+([^=&]+)=([^&]*)/gi;
  if (regex.test(window.location.search)) {
    window.location.search.replace(regex, function (str, key, value) {
      params[key] = value;
    });
  }
  return params;
}

// KAKAO share
function onKakaoShare() {
  const { Kakao } = window;
  sendApi({
    "key":"share",
    "value":1
  }).then(() => {
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "KRUSH(크러시) - 두근두근 플러팅 운세",
        description: '오늘의 플러팅 운세는 "내가쏠게"',
        imageUrl: `${siteUrl}/img/cap/sns_img01.png`,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: "KRUSH에서 확인",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
      ],
    });
  })
}

// URL copy
function onCopyUrl() {
  sendApi({
    "key":"copy",
    "value":1
  })
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert("URL이 복사되었습니다.");
      })
      .catch((err) => {
        alert(`복사 실패: ${err}`);
      });
  } else if (document.queryCommandSupported("copy")) {
    const input = document.createElement("input");
    input.value = window.location.href;
    document.body.appendChild(input);
    input.select();

    try {
      const successful = document.execCommand("copy");
      alert(successful ? "URL이 복사되었습니다." : "복사에 실패했습니다.");
    } catch (err) {
      alert(`복사 실패: ${err}`);
    }

    document.body.removeChild(input);
  } else {
    alert("클립보드 복사 기능이 지원되지 않는 브라우저입니다.");
  }
}

const gotoFortune = () => {
  const swiperWrapper = document.querySelector('#slider01');
  const swiper = swiperWrapper ? swiperWrapper.swiper : null; // Check if swiperWrapper exists

  const activeIndex = swiper.activeIndex; // 현재 활성화된 슬라이드 인덱스
  const activeSlide = swiper.slides[activeIndex]; // 현재 활성화된 슬라이드

  const imgOn = activeSlide.querySelector('.img_on'); // 활성화된 이미지 가져오기
  const imgValue = imgOn.getAttribute('value');

  // cap 값 가져오기
  const capFortune = randomFortune();
  sendApi({
    "key":"fortune",
    "value": {
      "fortune":imgValue,
      "result":capFortune
    }
  })
  window.location.href = `?cap=${capFortune}`;
};

const randomFortune = () => {
  // 랜덤으로 숫자 1-8 사이 하나 추출
  const randomNum = Math.floor(Math.random() * 8) + 1;
  return randomNum;
}

const retry = () => {
  sendApi({
    "key":"retry",
    "value":1
  }).then(() => {
    window.location.href='/'
  })
}

const sendApi = (data) => {
  return new Promise((resolve, reject) => { // 프로미스를 반환
    $.ajax({
      url: 'http://local.krush.com:8081/api/data',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (responseData) {
        console.log('서버로부터의 응답:', responseData);
        resolve(responseData); // 성공 시 프로미스를 해결
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error('에러 발생:', textStatus);
        reject(errorThrown); // 오류 시 프로미스를 거부
      },
    });
  });
}