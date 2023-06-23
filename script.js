var mobileMenuCloseButton = document.getElementById("mobile-menu-close-button")
var mobileMenuContainer = document.getElementById("mobile-menu-container")
var burgerButton = document.getElementById("burger-button")
var horizontalScroller = document.getElementById("horizontal-scroller")
var horizontaContainer = document.getElementById("horizontal-scroll-container")




// NAV MENU
mobileMenuCloseButton.addEventListener('click', () => {
    mobileMenuContainer.style.display = "none"
})

burgerButton.addEventListener('click', () => {
    mobileMenuContainer.style.display = "block"
})


// Gallery
var masonry
$(document).ready(() => {
        masonry = new MiniMasonry({
        container: '.gallery-container',
        surroundingGutter: false,
    });
})



function ChangeCategory(category){
    var galleryItems = $('.gallery-item')
    galleryItems.each((index, elem) => {

        if(category.toLowerCase() == 'all'){
            $(elem).show()
            masonry.layout()
            return
        }
    
        if($(elem).data("type") == undefined) {
            console.log("It is undefined")
            $(elem).hide()
            masonry.layout()
            return
        }
        else {
            $(elem).show() 
        }
        if($(elem).data("type").toLowerCase() != category.toLowerCase()){
            $(elem).hide()
        }
        else {
            $(elem).show() 
        }

        masonry.layout()
    });
}

function myFunction() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("myBtn");
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Read more";
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Read less";
      moreText.style.display = "inline";
    }
  }
  
  
//   var masonry2 = new MiniMasonry({
//     container: document.querySelector('.container_2'),
//     surroundingGutter: false,
//     gutterX: 40,
//     gutterY: 10
//   });


var dragValue = 0;
var isDragging = false
var lastDragValue = 0;


// Mobile Touches
window.addEventListener("touchmove", (event) => {

    if(isDragging == false) return


    var delta = lastDragValue - event.touches[0].screenX

    if(lastDragValue > event.touches[0].screenX){
        dragValue = -delta
    }
    else {
        dragValue = -delta
    }

    var scrollerWidth = horizontalScroller.clientWidth

    var offsets = horizontalScroller.getBoundingClientRect();
    var left = offsets.left

    if(left < -(scrollerWidth / 2)) 
    {
        left = -(scrollerWidth / 2)
    }
    else if(left > scrollerWidth / 2)
    {
        left = scrollerWidth / 2
    }

    horizontalScroller.style.left = left + dragValue + "px"

    lastDragValue = event.touches[0].screenX

})

window.addEventListener("touchstart", (event) => {
    if(horizontalScroller.contains(event.target)){
        isDragging = true
        dragValue = 0
        lastDragValue = event.touches[0].screenX
    }
})

window.addEventListener("touchend", (event) => {
    isDragging = false
})





window.addEventListener("mousemove", (event) => {

    if(isDragging == false) return


    var delta = lastDragValue - event.screenX
    console.log(delta)

    if(lastDragValue > event.screenX){
        dragValue = -delta
    }
    else {
        dragValue = -delta
    }

    var scrollerWidth = horizontalScroller.clientWidth

    var offsets = horizontalScroller.getBoundingClientRect();
    var left = offsets.left

    if(left < -(scrollerWidth / 2)) 
    {
        left = -(scrollerWidth / 2)
    }
    else if(left > scrollerWidth / 2)
    {
        left = scrollerWidth / 2
    }

    horizontalScroller.style.left = left + dragValue + "px"

    lastDragValue = event.screenX

})

window.addEventListener("mousedown", (event) => {
    if(horizontalScroller.contains(event.target)){
        isDragging = true
        dragValue = 0
        lastDragValue = event.screenX
    }
})

window.addEventListener("mouseup", (event) => {
    isDragging = false
})


$('.gallery-container').click(function(){
    $('.gallery-container').removeClass('active');
    $(this).addClass('active');
    
    var selector = $(this).attr('data-type');
    $('.gallery-item').isotope({
        filter:selector
    });
    return  false;
});
$(document).ready(function() {
var popup_btn = $('.popup-btn');
popup_btn.magnificPopup({
type : 'image',
gallery : {
    enabled : true
}
});
});
