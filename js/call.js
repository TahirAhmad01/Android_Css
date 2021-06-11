$(function() {
    $(".c_num").on("click", function(){
        var text = $(this).html();
        $("#num_text").text(
            $("#num_text").text() + text
        );

        var width = $( "#num_text" ).text().width();
        console.log(width)
    })

    $(".cut_number").on("click", function(){
        var nLenghth = $("#num_text").text().length - 1;

        $("#num_text").html(function(){
            return $(this).text().substring( 0 , nLenghth )
        }); 
    })
})
