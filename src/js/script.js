$(function() {
    $(".loader").fadeOut(500, function() {
        $(".page_wrapper").show();
    });
    
    //Create a canvas
    var canvas = new fabric.Canvas('c', {
        isDrawingMode: false
    });

    //Drag&drop area settings
    $('[name="image"]').ezdz({
        text: '<p>Drop or select a picture<p>',
        validators: {
            maxSize: 4000000
        },
        reject: function(file, errors) {
            if (errors.mimeType) {
                alert(file.name + ' must be jpg or png.');
            }
            if (errors.maxSize) {
                alert(file.name + ' must be size:4mb max.');
            }
        }
    });

    //Canvas background color
    $('.canvas-background-color').minicolors({
        defaultValue: '#fff',
    });
    var canvasbcolor = $(".canvas-background-color").val();
    canvas.backgroundColor = canvasbcolor;
    canvas.renderAll();

    $(".canvas-background-color").on("change", function() {
        var canvasbcolor = $(".canvas-background-color").val();
        canvas.backgroundColor = canvasbcolor;
        canvas.renderAll();
    });

    //Make an image canvas background
    $("#image-background").click(function() {
        var x = $('.ezdz-dropzone img').attr('src');
        canvas.setBackgroundImage(x,
            canvas.renderAll.bind(canvas), {
                width: 500,
                height: 400,
                backgroundImageStretch: false
            });

        $("#c").css("border", "none");
        return false;
    });

    //Add an image to canvas
    $("#image-on").click(function() {
        var x2 = $('.ezdz-dropzone img').attr('src');

        fabric.Image.fromURL(x2, function(oImg) {
            canvas.add(oImg);

        }, {
            "scaleX": 0.40,
            "scaleY": 0.40
        });

        $("#c").css("border", "none");
        return false;
    });

    //Default text color
    $('.text-color').minicolors({
        defaultValue: '#333',
    });

    //Hit enter and add text
    $('#text').bind('change keyup input', function(e) {
        var key = e.which;
        if (key == 13) {

            var myText = $("#text").val();
            $("#text").val('');

            var mycolor = $(".text-color").val();
            var myfont = $("#text-font option:selected").val();

            var text = new fabric.Text(myText, {
                fontFamily: myfont,
                fontSize: 40,
                fill: mycolor,
                left: 40,
                top: 50
            });
            text.hasRotatingPoint = true;
            canvas.add(text);

            $("#selection").trigger("click");
        }
        return false;
    });

    //Defaut draw color
    $('.draw-color').minicolors({
        defaultValue: '#333',
    });

    //Click button and start to draw
    $("#draw").click(function() {
        canvas.isDrawingMode = true;
        $(".draw-color").on("change", function() {
            var mycolor = $(".draw-color").val();
            canvas.freeDrawingBrush.color = mycolor;
            return false;
        });

        canvas.renderAll();
        $(this).addClass('active');
        $("#selection").removeClass('active');
        return false;
    });

    //Click button to activate selection mode
    $("#selection").addClass('active');
    $("#selection").click(function() {
        canvas.isDrawingMode = false;
        $(this).addClass('active');
        $("#draw").removeClass('active');
        return false;
    });

    //Update brush width
    $("#range").on("change", function() {
        var rangeVal = $(this).val();
        $("#value").val(rangeVal);
        canvas.freeDrawingBrush.width = rangeVal;
        return false;
    });

    $("#value").on("keyup", function() {
        var rangeShownVal = $(this).val();
        if (rangeShownVal < 51) {
            $("#range").val(rangeShownVal);
            canvas.freeDrawingBrush.width = rangeShownVal;
        } else {
            alert("Max is 50");
            var rangeVal2 = $("#range").val();
            $("#value").val(rangeVal2);
        }
        return false;
    });

    //Delete selected object
    function deleteObjects() {
        var activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveGroup();
        if (activeObject) {
            if (confirm('Are you sure?')) {
                canvas.remove(activeObject);
            }
        }
    };
    $("#delete").click(function() {
        deleteObjects();
        return false;
    });

    //Clear canvas
    $("#delete-all").click(function() {
        if (confirm('Are you sure?')) {
            canvas.backgroundImage = false;
            canvas.clear();
        }
        return false;
    });

    //Save canvas as image
    $("#save").click(function() {
        window.open(canvas.toDataURL('png'));
        return false;
    });
});

//About modal
var modal = $('.modal');
var overlay = $(".overlay");
overlay.hide();
$('.open-modal').click(function() {
    modal.show();
    overlay.show();
});

$('.close-modal').click(function() {
    modal.hide();
    overlay.hide();
});

$(".overlay").click(function() {
    modal.hide();
    overlay.hide();
});

//Confirmation before closing the tab
window.onbeforeunload = function(e) {
    e = e || window.event;
    if (e) {
        e.returnValue = 'Sure?';
    }
    return 'Sure?';
};
