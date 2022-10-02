// /* -------------------------------------- */
// /* -- [ Author > SHUBHAM J JOSHI ] -- */
// /* -------------------------------------- */

// /* _begin > Navigation Activation Code < SHB */
// $(document).ready(function() {
//     $(".slidebar .menu li a").each(function () {
//         var pathname1 = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
//         var pathname = pathname1.replace("#/", "");
//         if ($(this).attr('href') == pathname) {
//             $(this).parent().addClass('active');
//         }
//     });
// });
// /* _end > Navigation Activation Code < SHB */

// /* _begin > Select 2 Selection */
// $(document).ready(function () {
//     $('select').select2();
//     var elems = Array.prototype.slice.call(document.querySelectorAll('.check_box'));
//     elems.forEach(function (html) {
//         var switchery = new Switchery(html, {
//             color: '#2391f0',
//             secondaryColor: '#a3a4a6',
//             size: "small"
//         });
//     });
// });
// /* _end > Select 2 Selection */

// /* _begin > Masonary Grid For Explore Page < SHB */
// $(document).ready(function () {
//     $(".grid").imagesLoaded(function () {
//         $(".grid").masonry({
//             itemSelector: ".grid-item"
//         });
//     });
// });
// /* _end > Masonary Grid For Explore Page < SHB */

// /* _begin > PLYR Video Player < SHB */
// document.addEventListener('DOMContentLoaded', () => {
//     const controls = [
//                 'play-large', // The large play button in the center
//                 'mute', // Toggle mute
//                 'fullscreen',
//                 // 'duration',
//             ];
//     const player = Plyr.setup('.js-player', {
//         controls
//     });
// });
// /* _end > PLYR Video Player < SHB */
// /* _begin > On Hover Carousel Play < SHB */
// $('.hover-carousel').owlCarousel({
//     loop: false,
//     autoplay: true,
//     rewind:true,
//     autoplaySpeed: 800,
//     autoplayTimeout: 1000,
//     autoplayHoverPause: false,
//     margin: 1,
//     nav: false,
//     dots: true,
//     responsiveClass: true,
//     responsive: {
//         0: {
//             items: 1
//         },
//     }
// });

// var owl = $('.hover-carousel');
// owl.trigger('stop.owl.autoplay');

// $('.hover-carousel').on('mouseenter', function () {
//     owl.trigger('play.owl.autoplay', [1200]);
// })
// $('.hover-carousel').on('mouseleave', function () {
//     owl.trigger('stop.owl.autoplay');
//     owl.trigger('to.owl.carousel', 0);
// });

// /* _end > On Hover Carousel Play < SHB */


// $(document).ready(function () {
//     $(".nav-mob span").click(function () {
//         $(".nav-mob .submenu").slideToggle();
//     });
//     // $("#sidebar-close").click(function(){
//     // 	$(".content .slidebar").css({'left':'-250px'});
//     // 	$(".content .main-content").css({'width':'100%','margin-left':'0px'});
//     // });
//     $(".shopping-cart-close").click(function () {
//         $(".shopping-cart").removeClass("animate__fadeInRight").addClass("animate__fadeOutRight");
//     });
//     $(".shopping-cart-open").click(function () {
//         $(".shopping-cart").removeClass("animate__fadeOutRight").addClass("animate__fadeInRight");
//     });

//     var temptoggle = 0;
//     $(".slidebar-toggle").click(function () {
//         var a = $(window).width();

//         if (temptoggle == 0) {
//             $(".content .slidebar").css({
//                 'left': '0px'
//             });
//             $(".content .main-content").css({
//                 'width': '100%',
//                 'margin-left': '0px'
//             });
//             $("body#message").css({
//                 'overflow-y':'hidden'
//             });                 
//             temptoggle = 1;
//         } else if (temptoggle == 1) {
//             $(".content .slidebar").css({
//                 'left': '-250px'
//             });
//             $(".content .msg-sidebar").css({
//                 'left': '-325px'
//             });       
//             $(".content .main-content").css({
//                 'width': '100%',
//                 'margin-left': '0px'
//             });
//             $("body#message").css({
//                 'overflow-y':'inherit'
//             });                    
//             temptoggle = 0;
//         }
//     });
//      var temptoggles = 0;
//     $(".slidebar-toggle-right").click(function () {
//         var a = $(window).width();

//         if (temptoggles == 0) {
//             $(".side-menu-right-msg").css({
//                 'right': '0px'
//             });
//             $("body#message").css({
//                 'overflow-y':'hidden'
//             });            
//             temptoggles = 1;
//         } else if (temptoggles == 1) {
//             $(".side-menu-right-msg").css({
//                 'right': '-260px'
//             });
//             $("body#message").css({
//                 'overflow-y':'inherit'
//             });                      
//             temptoggles = 0;
//         }
//     });
//     $("#short-menu-toggle").click(function(){
//         $("#message .msg-box-adv.multi-specifi .message-bottom-bar-list-item").toggle();
//         $("#short-menu-toggle a").toggleClass("rotate-close");
//     });
//     // var btnmoretemps = 0;
//     // $(".side-menu-right-msg .toggle-dropmenu").hover(function () {
//     //     var a = $(window).width();
//     //     if (btnmoretemps == 0) {
//     //         $(".side-menu-right-msg .btn-more i").attr("class", "fa fa-angle-up");
//     //         btnmoretemps = 1;
//     //     } else if (btnmoretemps == 1) {
//     //         $(".side-menu-right-msg .btn-more i").attr("class", "fa fa-angle-down");
//     //         btnmoretemps = 0;
//     //     }
//     // });

//     var btnmoretemp = 0;
//     $(".search-bar-right .more-dropdown").hover(function (){
//         var a = $(window).width();
//         if (a < 992) {
//             $(".more-dropdown .dropdown-menu").removeClass("dropdown-menu-right");
//         } else {
//             $(".more-dropdown .dropdown-menu").addClass("dropdown-menu-right");
//         }
//         if (btnmoretemp == 0) {
//             $(".search-bar .btn-more i").attr("class", "fa fa-angle-up");
//             btnmoretemp = 1;
//         } else if (btnmoretemp == 1) {
//             $(".search-bar .btn-more i").attr("class", "fa fa-angle-down");
//             btnmoretemp = 0;
//         }
//     });

//     // BacktoTop Scrolling Function
//     $("#toTop").hide();
//     $(function () {
//         $(window).scroll(function () {
//             if ($(this).scrollTop() > 200) {
//                 $('#toTop').fadeIn();
//             } else {
//                 $('#toTop').fadeOut();
//             }
//         });
//     });
// });

// /* Right Sidebar JS*/

// function scrolling() {
//     var sticky = $('#stickyFix'),
//         scroll = $(window).scrollTop();

//     if (scroll >= 420) sticky.addClass('sticky-trending');
//     else sticky.removeClass('sticky-trending');
//     //    console.log("Scroll from Top: " + scroll.toString());
// };
// scrolling();
// $(window).scroll(scrolling);

// // -- Show disable shadow when right sidebar show up < SHB
// function showSlidebar() {
//     $('html').addClass('is-shadow');
//     $('body').css({
//         'overflow-y': 'hidden',
//     });
// }

// // -- Hide disable shadow when right sidebar going to hide < SHB
// function hideSlidebar() {
//     $('html').removeClass('is-shadow');
//     $('body').css({
//         'overflow-y': 'auto',
//     });
// }

// // -- Add class "open" when right sidebar show up
// $(document).ready(function () {
//     $(document).click(function (event) {
//         var clickover = $(event.target);
//         var _opened = $(".post-fixed-side-popup").hasClass("post-fixed-side-popup open");
//         if (_opened === true && !clickover.hasClass("close-popup")) {
//             console.log("in");
//             $("button.close-popup").click();
//         }
//     });
// });


// $('#menu-button').click(function (e) {
//    e.stopPropagation();
//    $('#hide-menu').toggleClass('show-menu');
// });
// $('#hide-menu').click(function (e) {
//    e.stopPropagation();
// });
// $('body,html').click(function (e) {
//    $('#hide-menu').removeClass('show-menu');
// });


// // -- For stop click on sidebar to hide sidebar
// $('.post-fixed-side-popup').click(function (o) {
//    o.stopPropagation();
// });

// // -- To Hide siderbar when click anywhere on the page except sidebar
// $('body,html').click(function (e) {
//    $('.post-fixed-side-popup').css({
//        'right': '-700px'
//    });
//    $('.post-fixed-side-popup#postDetails').removeClass('open');
//    hideSlidebar();
// });

// // -- Function to allow close icons to perform close right sidebar
// function closeFunction() {
//    $('html .post-fixed-side-popup').css({
//        'right': '-700px'
//    });
//    $('.post-fixed-side-popup').removeClass('open');
//    hideSlidebar();
// }

// $(document).on('click', '#sideOverHide', function (o) {
//     o.preventDefault();
//     $('html .post-fixed-side-popup').css({
//         'right': '-700px'
//     });
//     $('.post-fixed-side-popup#postDetails').removeClass('open');
//     $('#sideOverHide').addClass('d-none');
//     hideSlidebar();
// });

// // - // Slider Popup FOR Post Details_

// $(document).on('click', '.home-feed-post-image-wrapper', function (o) {
//     o.preventDefault();
//     $('.post-fixed-side-popup#postDetails').css({
//         'right': '0',
//     });
//     $('.post-fixed-side-popup#postDetails').addClass('open');
//     $('#sideOverHide').removeClass('d-none');
//     showSlidebar();
// });
// $(document).on('click', '.product-items-wrapper img', function (o) {
//     o.preventDefault();
//     $('.post-fixed-side-popup#postDetails').css({
//         'right': '0',
//     });
//     $('.post-fixed-side-popup#postDetails').addClass('open');
//     $('#sideOverHide').removeClass('d-none');
//     showSlidebar();
// });
// //
// //$(document).on('click', '.home-feed-single-post', function (o) {
// //    o.preventDefault();
// //    $('.post-fixed-side-popup#postDetails').css({
// //        'right': '0'
// //    });
// //});

// $(document).on('click', '.post-fixed-side-popup#postDetails .close-popup', function (o) {
//     o.preventDefault();
//     //    o.stopImmediatePropagation();
//     $('html .post-fixed-side-popup').css({
//         'right': '-700px'
//     });
//     $('.post-fixed-side-popup#postDetails').removeClass('open');
//     $('#sideOverHide').addClass('d-none');
//     hideSlidebar();
// });

// // - // Slider Popup FOR Comments_

// $(document).on('click', '.post-comment', function (o) {
//     o.preventDefault();
//     $('.post-fixed-side-popup#postComment').css({
//         'right': '0'
//     });
//     $('.post-fixed-side-popup#postDetails').addClass('open');
//     $('#sideOverHide').removeClass('d-none');
//     showSlidebar();
// });

// $(document).on('click', '#postComment .close-popup', function (o) {
//     o.preventDefault();
//     o.stopPropagation();
//     $('.post-fixed-side-popup').css({
//         'right': '-700px'
//     });
//     $('.post-fixed-side-popup#postDetails').removeClass('open');
//     $('#sideOverHide').addClass('d-none');
//     hideSlidebar();
// });


// $(document).on('click', '.postComment-Report', function (o) {
//     o.preventDefault();
//     $('.post-fixed-side-popup#postComment-Report').css({
//         'right': '0'
//     });
//     $('.post-fixed-side-popup#postDetails').addClass('open');
//     $('#sideOverHide').removeClass('d-none');
//     showSlidebar();
// });

// $(document).on('click', '#postComment-Report .close-popup', function (o) {
//     o.preventDefault();
//     o.stopPropagation();
//     $('.post-fixed-side-popup').css({
//         'right': '-700px'
//     });
//     $('.post-fixed-side-popup#postDetails').removeClass('open');
//     $('#sideOverHide').addClass('d-none');
//     hideSlidebar();
// });

// // - // Slider Popup FOR Post Share Options_

// $(document).on('click', '.post-send-icon', function (o) {
//     o.preventDefault();
//     $('.post-fixed-side-popup#postShareSlider').css({
//         'right': '0'
//     });
//     $('.post-fixed-side-popup#postDetails').addClass('open');
//     $('#sideOverHide').removeClass('d-none');
//     showSlidebar();
// });

// $(document).on('click', '#postShareSlider .close-popup-sidebar', function (o) {
//     o.preventDefault();
//     o.stopPropagation();
//     $('.post-fixed-side-popup').css({
//         'right': '-700px'
//     });
//     $('.post-fixed-side-popup#postDetails').removeClass('open');
//     $('#sideOverHide').addClass('d-none');
//     hideSlidebar();
// });

// // - // Slider Popup FOR Post Promote_

// $(document).on('click', '.post-promote', function (o) {
//     o.preventDefault();
//     $('.post-fixed-side-popup#postPromote').css({
//         'right': '0'
//     });
//     $('.post-fixed-side-popup#postDetails').addClass('open');
//     $('#sideOverHide').removeClass('d-none');
//     showSlidebar();
// });

// $(document).on('click', '#postPromote .close-popup', function (o) {
//     o.preventDefault();
//     o.stopPropagation();
//     $('.post-fixed-side-popup').css({
//         'right': '-700px'
//     });
//     $('.post-fixed-side-popup#postDetails').removeClass('open');
//     $('#sideOverHide').addClass('d-none');
//     hideSlidebar();
// });

// // - // Slider Popup FOR Shop Similar Items_

// $(document).on('click', '.home-feed-post-shop-btn', function (o) {
//     o.preventDefault();
//     $('.post-fixed-side-popup#postSimilarProduct').css({
//         'right': '0'
//     });
//     $('.post-fixed-side-popup#postDetails').addClass('open');
//     $('#sideOverHide').removeClass('d-none');
//     showSlidebar();
// });

// $(document).on('click', '.home-prod-post-view-btn', function (o) {
//     o.preventDefault();
//     $('.post-fixed-side-popup#postSimilarProduct').css({
//         'right': '0'
//     });
//     $('.post-fixed-side-popup#postDetails').addClass('open');
//     $('#sideOverHide').removeClass('d-none');
//     showSlidebar();
// });

// $(document).on('click', '#postSimilarProduct .close-popup-sidebar', function (o) {
//     o.preventDefault();
//     o.stopPropagation();
//     $('.post-fixed-side-popup').css({
//         'right': '-700px'
//     });
//     $('.post-fixed-side-popup#postDetails').removeClass('open');
//     $('#sideOverHide').addClass('d-none');
//     hideSlidebar();
// });

// $(".goPromote").click(function () {
//     $(".eligibleWrapper").addClass('d-none');
//     $("#promote-option").removeClass('d-none');
// });

// // - // Slider Popup FOR Post Buy Me Coffee_

// $(document).on('click', '.buy-coffee', function (o) {
//     o.preventDefault();
//     $('.post-fixed-side-popup#buyMeCoffee').css({
//         'right': '0'
//     });
//     $('.post-fixed-side-popup#buyMeCoffee').addClass('open');
//     $('#sideOverHide').removeClass('d-none');
//     showSlidebar();
// });

// $(document).on('click', '#buyMeCoffee .close-popup', function (o) {
//     o.preventDefault();
//     o.stopPropagation();
//     $('.post-fixed-side-popup').css({
//         'right': '-700px'
//     });
//     $('.post-fixed-side-popup#buyMeCoffee').removeClass('open');
//     $('#sideOverHide').addClass('d-none');
//     hideSlidebar();
// });

// // CHNG-201112

// if ($(window).width() > 768) {
//     function headerTopSpace() {
//         var head_height = $("header").outerHeight(true);
//         $(".slidebar .menu").css("height", "calc(100vh - " + head_height + "px)");
//     };
//     headerTopSpace();
//     $(window).resize(headerTopSpace);
// }
// //if ($(window).width() < 767) {
// //    function headerTopSpace() {
// //        $(".slidebar .menu").css("bottom", "0px")
// //    };
// //    headerTopSpace();
// //    $(window).resize(headerTopSpace);
// //}

// // For Open New Message Popup
// // $(".btn-new-message").click(function () {
// //     $(".email-message-box").addClass('popup-show');
// //     $(".email-message-box").show();
// // });
// // $("#message .main-down-user").click(function () {
// //     $(".multi-specifi").addClass('popup-show');
// //     $(".multi-specifi").show();
// // });
// // function emailbox(emailbox){
// //     $(emailbox).toggleClass('popup-minimize');
// // }
// // function emailclose(msg){
// //     $(msg).removeClass('popup-show');
// //     $(msg).hide();
// // }

// // // For Minimize & Maximize New Message Popup
// // function msgbox(msg){
// //     $(msg).toggleClass('popup-minimize');
// // }
// // function msgclose(msg){
// //     $(msg).removeClass('popup-show');
// //     $(msg).hide();
// // }
// // function msgminmax(msg){
// //     $(msg).toggleClass('maximize-min');
// // }

// // // topupmessagebox
// // $("#message .main-top-popup").click(function () {
// //     $(".msg-box-diffrent").addClass('popup-show');
// //     $(".msg-box-diffrent").show();
// // });
// // function msgtopup(msg){
// //     $(msg).toggleClass('popup-minimize');
// // }
// // function msgtopupclose(msg){
// //     $(msg).removeClass('popup-show');
// //     $(msg).hide();
// // }
// // function msgtopupminmax(msg){
// //     $(msg).toggleClass('maximize-min');
// // }

// // var fsmsgbox = 0;
// // $(".side-menu-right-msg .more-dropdown").hover(function () {
// //     var a = $(window).width();
// //     if (fsmsgbox == 0) {
// //         $(".side-menu-right-msg .btn-more i").attr("class", "fa fa-angle-up");
// //         fsmsgbox = 1;
// //     } else if (fsmsgbox == 1) {
// //         $(".side-menu-right-msg .btn-more i").attr("class", "fa fa-angle-down");
// //         fsmsgbox = 0;
// //     }
// // });

// // $(".inbox-action-btn.minimize").click(function () {
// //     $(".multiple-box-start.message-box").toggleClass('popup-minimize');
// // });

// // For Open Save Replies Popup & Close New Message Popup
// $(".save-replies").click(function () {
//     $(".saved-replies-box").addClass('popup-show');
//     $(".message-box").removeClass('popup-show');
// });

// // For Close Save Replies Popup &  Open New Message Popup
// $(".times-close").click(function () {
//     $(".saved-replies-box").removeClass('popup-show');
// });

// // For Open Create Replies Popup & Close Save Replies Popup
// $(".create-new-reply").click(function () {
//     $(".create-reply").addClass('popup-show');
//     $(".saved-replies-box").removeClass('popup-show');
// });

// // For Close Create Replies Popup &  Open Save Replies Popup
// $(".get-back-from-saved-reply").click(function () {
//     $(".create-reply").removeClass('popup-show');
//     $(".saved-replies-box").addClass('popup-show');
// });

// $(".btn-reply-action").click(function () {
//     $(".create-reply").removeClass('popup-show');
//     $(".saved-replies-box").addClass('popup-show');
// });

// //function changeImage() {
// //    element = document.getElementById('minimizeChange')
// //    if (element.src.match("images/icons/inbox-minimize.svg")) {
// //        element.src = "images/icons/inbox-minimize-white.svg";
// //    } else {
// //        element.src = "images/icons/inbox-minimize.svg";
// //    }
// //
// //    closebox = document.getElementById('closeChange')
// //    if (closebox.src.match("images/icons/inbox-close.svg")) {
// //        closebox.src = "images/icons/inbox-close-white.svg";
// //    } else {
// //        closebox.src = "images/icons/inbox-close.svg";
// //    }
// //}

// $(".message-emoji").click(function () {
//     $(".emoji-box").toggleClass('d-block');
// });

// $(".inbox-product-list").click(function () {
//     $(".product-box").toggleClass('d-block');
// });

// $(".post-fixed-replies").click(function () {
//     $(".comments-child-comments").toggleClass("d-block");
// });

// $(".edit-comment-item").click(function () {
//     $(".post-comment-editor-wrap").toggleClass("d-block");
// });

// function changeImage() {
//     element = document.getElementById("postSave");
//     if (element.src.match("images/icons/icons-post-save.svg")) {
//         element.src = `images/icons/icons-post-saved.svg`;
//     } else {
//         element.src = 'images/icons/icons-post-save.svg';
//     }
// }

// $('.post-action post-save').click(function (e) {
//     e.preventDefault();
//     changeImage();
// });

// //$(document).on('click', '#postSimilarProduct .close-popup-sidebar', function (o) {
// //    o.preventDefault();
// //
// //    $('.post-fixed-side-popup').css({
// //        'right': '-700px',
// //        '-webkit-transition': 'all 0.7s ease 0s',
// //        '-moz-transition': 'all 0.7s ease 0s',
// //        '-ms-transition': 'all 0.7s ease 0s',
// //        '-o-transition': 'all 0.7s ease 0s',
// //        'transition': 'all 0.7s ease 0s'
// //    });
// //});

// //if ($(window).width() < 767) {
// //
// //    $(document).on('click', '.close-popup-sidebar', function (o) {
// //        o.preventDefault();
// //
// //        $('#post-fixed').css({
// //            'right': '-100%',
// //            '-webkit-transition': 'all 0.7s ease 0s',
// //            '-moz-transition': 'all 0.7s ease 0s',
// //            '-ms-transition': 'all 0.7s ease 0s',
// //            '-o-transition': 'all 0.7s ease 0s',
// //            'transition': 'all 0.7s ease 0s'
// //        });
// //    });
// //
// //    $(document).on('click', '.close-popup', function (o) {
// //        o.preventDefault();
// //
// //        $('.post-fixed-side-popup').css({
// //            'right': '-100%',
// //            '-webkit-transition': 'all 0.7s ease 0s',
// //            '-moz-transition': 'all 0.7s ease 0s',
// //            '-ms-transition': 'all 0.7s ease 0s',
// //            '-o-transition': 'all 0.7s ease 0s',
// //            'transition': 'all 0.7s ease 0s'
// //        });
// //    });
// //}


// $(document).on('click', '#postSimilarProduct .close-popup-sidebar', function (o) {
//     $('.post-fixed-side-popup#postDetails').removeClass('open');
//     $('#sideOverHide').addClass('d-none');
// });


// $('button#goToCart').click(function () {
//     $('.shopping-cart-container').removeClass('d-none');
//     $('.shopping-empty').addClass('d-none');
//     $('.cart-item-counter').css({
//         'display': 'inline-flex'
//     });
// });

// $('button#viewCart').click(function () {
//     $('.shopping-cart-container').addClass('d-none');
//     $('.shopping-empty').removeClass('d-none');
//     $('.cart-item-counter').css({
//         'display': 'none'
//     });
// });



// $(document).ready(function(){
//     $(".remove-text").click(function(){
//         $(this).parents(".address-div").remove();
//     });
// });

// $(function(){
//     $(".connect-text").click(function () {
//        $(this).text(function(i, text){
//            return text === "Connect" ? "Connected" : "Connect";
//        })
//        $(this).parents(".connect-button").next(".disconnect-text").toggle();
//     });
//  })

//  $(function(){
//     $(".disconnect-text").click(function () {
//         var ctext = $(this).siblings(".connect-button").children(".connect-text");
//        $(ctext).text(function(i, text){
//            return text === "Connected" ? "Connect" : "Connected";
//        })
//        $(this).toggle();
//     });
//  })

//  $(document).ready(function(){
//     $(".set-default").click(function(){
//       $(".default-add-text").html("(Default)");
//     });
//   });



// $('.slash-title').bind('keydown', function(event) {
//     if (event.keyCode == 191) {
//          $('.dropdown').addClass('show');
//          $('.dropdown-menu').addClass('show');
//     }
//     if (event.keyCode == 8) {
//         $('.dropdown').removeClass('show');
//         $('.dropdown-menu').removeClass('show');
//    }
// });



//     function each(arr, callback) {
//       var length = arr.length;
//       var i;

//       for (i = 0; i < length; i++) {
//         callback.call(arr, arr[i], i, arr);
//       }

//       return arr;
//     }

//     var lastcount = 0;

  

// // Create a class for the element
// class Collection extends HTMLElement {
//     constructor() {
//         super(); // Always call super first in constructor
//     }
// }

// // Define the new element
// customElements.define('shb-collection', Collection);

// $('.second-li').click(function () {
//     $('.message-section').removeClass('hide-msg');
//     $('.start-msg').addClass('hide-msg');
// });


// function isDevice() {
//     return ((/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent
//         .toLowerCase())))
// }

// function initZoom(width, height) {
//     $.removeData('#zoom_10', 'elevateZoom');
//     $('.zoomContainer').remove();
//     $('.zoomWindowContainer').remove();
//     $("#zoom_10").elevateZoom({
//         responsive: true,
//         tint: true,
//         tintColour: '#E84C3C',
//         tintOpacity: 0.5,
//         easing: true,
//         borderSize: 0,
//         lensSize: 100,
//         constrainType: "height",
//         loadingIcon: "https://icodefy.com/Tools/iZoom/images/loading.GIF",
//         containLensZoom: false,
//         zoomWindowPosition: 1,
//         zoomWindowOffetx: 20,
//         zoomWindowWidth: width,
//         zoomWindowHeight: height,
//         gallery: 'gallery_pdp',
//         galleryActiveClass: "active",
//         zoomWindowFadeIn: 500,
//         zoomWindowFadeOut: 500,
//         lensFadeIn: 500,
//         lensFadeOut: 500,
//         cursor: "https://icodefy.com/Tools/iZoom/images/zoom-out.png",
//     });
// }

// $(document).ready(function () {
//     /* init vertical carousel if thumb image length greater that 4 */
//     if ($("#gallery_pdp a").length > 4) {
//         $("#gallery_pdp a").css("margin", "0");
//         $("#gallery_pdp").rcarousel({
//             orientation: "vertical",
//             visible: 4,
//             width: 105,
//             height: 70,
//             margin: 5,
//             step: 1,
//             speed: 500,
//         });
//         $("#ui-carousel-prev").show();
//         $("#ui-carousel-next").show();
//     }
//     /* Init Product zoom */
//     initZoom(500, 475);

//     $("#ui-carousel-prev").click(function () {
//         initZoom(500, 475);
//     });

//     $("#ui-carousel-next").click(function () {
//         initZoom(500, 475);
//     });

//     $(".zoomContainer").width($("#zoom_10").width());

//     $("body").delegate(".fancybox-inner .mega_enl", "click", function() {
//         $(this).html("");
//         $(this).hide();
//     });
//     $('#gallery_pdp img').click((e) => {
//         console.log(e)
//     })

// });

// $(window).resize(function () {
//     var docWidth = $(document).width();
//     if (docWidth > 769) {
//         initZoom(500, 475);
//     } else {
//         $.removeData('#zoom_10', 'elevateZoom');
//         $('.zoomContainer').remove();
//         $('.zoomWindowContainer').remove();
//         $("#zoom_10").elevateZoom({
//             responsive: true,
//             tint: false,
//             tintColour: '#3c3c3c',
//             tintOpacity: 0.5,
//             easing: true,
//             borderSize: 0,
//             loadingIcon: "https://icodefy.com/Tools/iZoom/images/loading.GIF",
//             zoomWindowPosition: "productInfoContainer",
//             zoomWindowWidth: 330,
//             gallery: 'gallery_pdp',
//             galleryActiveClass: "active",
//             zoomWindowFadeIn: 500,
//             zoomWindowFadeOut: 500,
//             lensFadeIn: 500,
//             lensFadeOut: 500,
//             cursor: "https://icodefy.com/Tools/iZoom/images/zoom-out.png",
//         });

//     }
// })

// $(document).ready(function () {
//     $("#zoom_10").fancybox();
// });


// // message-upload-images
//   // $("button").click(function(){
//   //   $("input").trigger("click");
//   // });



// // $('.active-deactive').click(function() {
// //     $(".active-online").addClass('active');
// //     $('#content').toggle();
// // }), function() { 
// //     $(this).removeClass('active');
// // };

// $(document).ready(function() {
// // $(".active-deactive").click(function () {
// //   if(".active-online.active"){
// //     $(".deactive-offline").removeClass("active");
// //   }
// //   else{
// //     $(".deactive-offline").addClass("active");
// //   }
// // });
//     $(function(){
//         $('.active-deactive').click(function(){
//             $('.active-online').toggleClass('active');
//             if('.active-online.active'){
//                 $('.deactive-offline').toggle();
//             }
//         });

//         $("#foreign_checkbox").click(function() {
//             if($('#foreign_checkbox').is(':checked')) { 
//                 $('.private-switch').removeClass("d-none");
//                 $('.public-switch').addClass("d-none");
//             } else {
//                 $('.private-switch').addClass("d-none");
//                 $('.public-switch').removeClass("d-none");
//             }
//         });
//     });
// });

// function chatcreateclose(msg){
//     $(msg).removeClass('popup-show');
//     $(msg).hide();
// }


// // auto height
// function autoheight(x) {
//     x.style.height = "0px";
//     x.style.height = (0+x.scrollHeight)+"px";
// }

// function getactive(){
//     $(".getactive").removeClass("d-none");
//     $(".getdeactive").addClass("d-none");
// }

// function getdeactive(){
//     $(".getactive").addClass("d-none");
//     $(".getdeactive").removeClass("d-none");    
// }

// $(".alert .close").click(function(){
//     $(".alert .close").parent().addClass('d-none');
// }); 

// $(".notification-setting").click(function() {
//     $("#notification-setting").removeClass('d-none');
// });

// $(".auth-admin-add-remove").click(function() {
//     $("#auth-admin-add-remove").removeClass('d-none');
// });
// $(".repost-public-channel").click(function() {
//     $("#repost-public-channel").removeClass('d-none');
// });

// // Store Details Find Next
//  $('.store-next-btn').click(function(){
//   $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").next('li.nav-item').find('a.nav-link').trigger('click');
// });

//   $('.store-back-btn').click(function(){
//   $('#StoreDetails .nav-item > .nav-link.active').parent("#StoreDetails li.nav-item").prev('li.nav-item').find('a.nav-link').trigger('click');
// });

// // store details display none
// $("#StoreDetails .brand-information").addClass("d-none");
// $('.store-detail-submit').click(function(){
//     $("#StoreDetails .brand-information").removeClass("d-none");
//     $("#StoreDetails form").addClass("d-none");
// });

// // upload - images
// $(".images-upload-multiple .user-serachbar-reference").hide();
// $(".user-icon").click(function(){
//     $(".images-upload-multiple .user-serachbar-reference").toggle();
//     $(".images-upload-multiple .product-box").hide();
// });
// $(".images-upload-icon-main a.product-icon").click(function(){
//     $(".images-upload-multiple .product-box").toggle();
//     $(".images-upload-multiple .user-serachbar-reference").hide();
// });
// $("div.images-search-close .product-icon").click(function(){
//     $(".images-upload-multiple .user-serachbar-reference").hide();
// });
// $("li.images-search-close .product-icon").click(function(){
//     $(".images-upload-multiple .product-box").hide();
// });

// // images-upload-title-toggle
// $(document).ready(function() {
//   $('.advance-catogary-inner').hide();
//   $('.advance-catogary').on('click',function() {
//     $('.advance-catogary-inner').toggle();
//     $(".advance-catogary img").toggleClass("rotateicon");
//   });
// });


// // images upload - next page
// $(".images-upload-title-section").hide();
// $(".add-photo-nextbtn").click(function(){
//     $(".images-upload-title-section").toggle();
//     $(".images-upload-section-main").hide();
// });
// $(".images-title-section-backbtn").click(function(){
//     $(".images-upload-section-main").toggle();
//     $(".images-upload-title-section").hide();
// });

// $("#checkbox-user-main").on('change', function() {
//   if ($(this).is(':checked')) {
//     $('.embed-product-preview').addClass("embed-preview-checked");
//   } else {
//     $('.embed-product-preview').removeClass("embed-preview-checked");
//   }
// });


// jQuery(document).ready(function($){
//     // This is for the dropdown list example:
//     $('.dropdownlist').change(function(){
//         etalage_show( $(this).find('option:selected').attr('class') );
//     });
// });


// $(function(){

// });

// $(document).ready(function() {
//     $("#product-slider-main").owlCarousel({
//         items : 5,
//         margin:25,
//         nav:true,
//         itemsDesktop:[1199,4],
//         itemsDesktopSmall:[980,3],
//         itemsMobile : [600,1],
//         pagination:true,
//         autoPlay:true,
//         navText: ['<span aria-label="Previous"><i class="fa fa-angle-left"></i></span>','<span aria-label="Next"><i class="fa fa-angle-right"></i></span>'],
//     });

//     $("#product-slider-main-second").owlCarousel({
//         items : 5,
//         margin:25,
//         nav:true,
//         itemsDesktop:[1199,4],
//         itemsDesktopSmall:[980,3],
//         itemsMobile : [600,1],
//         pagination:true,
//         autoPlay:true,
//         navText: ['<span aria-label="Previous"><i class="fa fa-angle-left"></i></span>','<span aria-label="Next"><i class="fa fa-angle-right"></i></span>'],
//       });
//     });

//     //  music-details audio
//     document.addEventListener('DOMContentLoaded', function() {
//         new GreenAudioPlayer('.ready-player-1', { showTooltips: true, showDownloadButton: false, enableKeystrokes: true });
//     });

//     // catogory-checkbox
//     var group_=(el,callback)=>{
//     el.forEach((checkbox)=>{
//     callback(checkbox)
//          })
//     }
//     group_(document.getElementsByName('ProductType'),(item)=>{
//     item.onclick=(e)=>{
//     group_(document.getElementsByName('ProductType'),(item)=>{
//     item.checked=false;
//     })
//     e.target.checked=true;
//     }
//     });

// // country 
// $(document).ready(function() {
//  $('.input-phone').intlInputPhone();
// })

// $(document).ready(function () {
// $('.user-profile .from-right .dropdown').hover(function () {
//         $(this).find('.dropdown-menu').first().stop(true, true).slideDown(150);
//     }, function () {
//         $(this).find('.dropdown-menu').first().stop(true, true).slideUp(105)
//     });
// });

// // user-profile
// $(".schedule-pick").click(function(){
// $(".schedule-pick-date").toggle();
// });

// $(".upload-delivery").click(function(){
// $(".upload-delivery-note form .admin-form-table").toggle();
// });

// //  on hover product zoomer
// $(".sticky-product-details-main .slider-preview li").hover(function(){
//     $(".zoom-side").toggleClass('d-none');
// });

// $(".chat-rep-changebox-second").addClass("d-none");
// $(".chat-msg-replies").click(function(){
//     $(".chat-rep-changebox-second").removeClass("d-none");
//     $(".chat-rep-changebox-first").addClass("d-none");
// });
// $(".shipment-backicon-chat .shipment-backicon").click(function(){
//     $(".chat-rep-changebox-second").addClass("d-none");
//     $(".chat-rep-changebox-first").removeClass("d-none");
// });