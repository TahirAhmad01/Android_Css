$(function() {
    $(".c_num").on("click", function(){
        var text = $(this).html();
        $("#num_text span").text(
            $("#num_text span").text() + text
        );

        var width = $( "#num_text span" ).width();
        var m_width = $( "#num_text" ).width();
        var calc =  width - m_width;
        if (calc => 0){
            $( "#num_text" ).scrollLeft( calc )
        }
    })

    $('.cut_number').on('mousedown touchstart', function() {
        timeoutId = setInterval(function(){
            var nLenghth = $("#num_text span").text().length - 1;

            $("#num_text span").html(function(){
                return $(this).text().substring( 0 , nLenghth )
            }); 

        },200);
    }).on('mouseup mouseleave touchend', function() {
        clearInterval(timeoutId);
    });

    $(".cut_number").on("click", function(){
        var nLenghth = $("#num_text span").text().length - 1;

        $("#num_text span").html(function(){
            return $(this).text().substring( 0 , nLenghth )
        }); 
    })

    $(".call-ico").on("click", function(){
        $("#num_text span").empty();
    })
})
