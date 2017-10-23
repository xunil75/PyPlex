{% autoescape true %}
var element;
//var Captchalert;
//root = this;
function humanFileSize(f) {
    var c, d, e, b;
    d = new Array("B", "KiB", "MiB", "GiB", "TiB", "PiB");
    b = Math.log(f) / Math.log(1024);
    e = Math.floor(b);
    c = Math.pow(1024, e);
    if (f === 0) {
        return "0 B";
    } else {
        return Math.round(f * 100 / c) / 100 + " " + d[e];
    }
};
function parseUri() {
    var b, c, g, e, d, f, a;
    b = $("#add_links").value();
    g = new RegExp("(ht|f)tp(s?)://[a-zA-Z0-9-./?=_&%#]+[<| |\"|'|\r|\n|\t]{1}", "g");
    d = b.match(g);
    if (d === null) {
        return;
    }
    e = "";
    for (f = 0, a = d.length; f < a; f++) {
        c = d[f];
        if (c.indexOf(" ") !== -1) {
            e = e + c.replace(" ", " \n");
        } else {
            if (c.indexOf("\t") !== -1) {
                e = e + c.replace("\t", " \n");
            } else {
                if (c.indexOf("\r") !== -1) {
                    e = e + c.replace("\r", " \n");
                } else {
                    if (c.indexOf('"') !== -1) {
                        e = e + c.replace('"', " \n");
                    } else {
                        if (c.indexOf("<") !== -1) {
                            e = e + c.replace("<", " \n");
                        } else {
                            if (c.indexOf("'") !== -1) {
                                e = e + c.replace("'", " \n");
                            } else {
                                e = e + c.replace("\n", " \n");
                            }
                        }
                    }
                }
            }
        }
    }
    return $("#add_links").value = e
};
Array.prototype.remove = function(d, c) {
    var a, b;
    a = this.slice((c || d) + 1 || this.length);
    this.length = (b = d < 0) != null ? b : this.length + {
        from: d
    };
    if (this.length === 0) {
        return [];
    }
    return this.push.apply(this, a);
};
$(function() {
    $("#add_form").submit(function(event) {
        event.preventDefault();
        if ($("#add_name").value === "" && $("#add_file").value === "") {
            alert('{{_("Please Enter a packagename.")}}');
            return false;
        } else {
            var form = new FormData(this);
            $.ajax({
                    url: "/json/add_package",
                    method: "POST",
                    data: form,
                    processData: false,
                    contentType: false,
            });
            $('#add_box').modal('hide');
            return false;
        }
    });
    $("#action_add").click(function() {
        $("#add_form").trigger("reset");
    });

    $("#action_play").click(function() {
        $.get( "/api/unpauseServer" );
    });

    $("#action_cancel").click(function() {
        $.get( "/api/stopAllDownloads" );
    });

    $("#restart_failed").click(function() {
        $.get( '/api/restartFailed',function(data) {        
            $.bootstrapPurr('{{_("Success")}}.',{
            offset: { amount: 10},
            type: 'success',
            align: 'center',
            draggable: false
        });
       });
    });
    
    $("#del_finished").click(function() {
        $.get( '/api/deleteFinished', function(data) {
            if (data.length > 0) {
                $.bootstrapPurr('{{_("Success")}}.',{
                offset: { amount: 10},
                type: 'success',
                align: 'center',
                draggable: false
                });
            }
        });
    });
    
    $("#action_stop").click(function() {
        $.get( "/api/pauseServer" );
    });

    $("#cap_info").click(function() {
        load_captcha("get", "");
    });

    $("#cap_submit").click(function() {
            submit_captcha();
            // stop()??
    });

    $("#cap_box #cap_positional").click(on_captcha_click);
    $.ajax({
        method:"post",
        url:"/json/status",
        async: true,
        timeout: 3000,
        success:LoadJsonToContent
    });
    setInterval(function() {
        $.ajax({
            method:"post",
            url:"/json/status",
            async: true,
            timeout: 3000,
            success:LoadJsonToContent
        });
    }, 4000);
});

function LoadJsonToContent(a) {
    $("#speed").text(humanFileSize(a.speed) + "/s");
    $("#aktiv").text( a.active);
    $("#aktiv_from").text(a.queue);
    $("#aktiv_total").text(a.total);
    if (a.captcha) {
        if ($("#cap_info").css("display") === "none") {
            $("#cap_info").css('display','inline');
            element=$.bootstrapPurr('{{_("New Captcha Request")}}',{
                offset: { amount: 10},
                align: 'center',
                draggable: false
            });
        }
    } else {
        $("#cap_info").css('display','none');
    }
    if (a.download) {
        $("#time").text(' {{_("on")}}');
        $("#time").css('background-color','#5cb85c');
    } else {
        $("#time").text(' {{_("off")}}');
        $("#time").css('background-color',"#d9534f");
    }
    if (a.reconnect) {
        $("#reconnect").text(' {{_("on")}}');
        $("#reconnect").css('background-color',"#5cb85c");
    } else {
        $("#reconnect").text(' {{_("off")}}');
        $("#reconnect").css('background-color',"#d9534f");
    }
    return null
};
function set_captcha(a) {
    $("#cap_id").val(a.id);
    if (a.result_type === "textual") {
        $("#cap_textual_img").attr("src", a.src);
        $("#cap_submit").css("display", "inline");
        $("#cap_box #cap_title").text('');
        $("#cap_textual").css("display", "block");
        return $("#cap_positional").css("display", "none");
    } else {
        if (a.result_type === "positional") {
            $("#cap_positional_img").attr("src", a.src);
            $("#cap_box #cap_title").text( '{{_("Please click on the right captcha position.")}}');
            $("#cap_submit").css("display", "none");
            return $("#cap_textual").css("display", "none");
        }
    }
};
function load_captcha(b, a) {
    $.ajax({
            url: "/json/set_captcha",
            async: true,
            method: b,
            data: a,
            success: function(c) {
                set_captcha(c);
                return (c.captcha ? void 0 : clear_captcha());
        }
    });
};

function clear_captcha() {
    $("#cap_textual").css("display", "none");
    $("#cap_textual_img").attr("src", "");
    $("#cap_positional").css("display", "none");
    $("#cap_positional_img").attr("src", "");
    $("#cap_submit").css("display", "none");
    $("#cap_box #cap_title").text( '{{_("No Captchas to read.")}}');
    $('#cap_box').modal('toggle');
};
function submit_captcha() {
    load_captcha("post", "cap_id=" + $("#cap_id").val() + "&cap_result=" + $("#cap_result").val());
    $("#cap_result").val("");
    return false;
};
function on_captcha_click(c) {
    var b, a, d;
    // b = c.target.getPosition();
    var x = (c.pageX - $(this).offset().left).toFixed(0);
    var y = (c.pageY - $(this).offset().top).toFixed(0);
    $("#cap_box #cap_result").val( x + ' , ' + y );
    return submit_captcha();
}; 
{% endautoescape %}