$(document).ready(function () {
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
  console.log(Kakao.isInitialized());
});

const siteUrl = "https://metamonster-dev.github.io/krush-publishing";

// STEP show / hide
function onStepActive(step) {
  $(".step_section").addClass("d-none");
  $(`.step_section#${step}`).removeClass("d-none");
}

// Modal show / hide
function onModalShow() {
  $(".modal_wrap").addClass("show");
}
function onModalHide() {
  $(".modal_wrap").removeClass("show");
}

// KAKAO share
function onKakaoShare() {
  const { Kakao } = window;

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
}

// URL copy
function onCopyUrl() {
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
