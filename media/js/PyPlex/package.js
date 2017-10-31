var root = this;

$(function() {
});

function indicateLoad() {
    $("#load-indicator").css('opacity',1)
}

function indicateFinish() {
    $("#load-indicator").css('opacity',0)
}

function indicateSuccess() {
    indicateFinish();
    $.bootstrapPurr('{{_("Success")}}.',{
        offset: { amount: 10},
        type: 'success',
        align: 'center',
        draggable: false
    });
}

function indicateFail() {
    indicateFinish();
    $.bootstrapPurr('{{_("Failed")}}.',{
        offset: { amount: 10},
        type: 'danger',
        align: 'center',
        draggable: false
    });
}

function PackageUI (url, type){
    var packages= [];
    var thisObject;
    this.initialize= function(url, type) {
        thisObject=this;
        this.url = url;
        this.type = type;

        $("#del_finished").click(this.deleteFinished);
        $("#restart_failed").click(this.restartFailed);
        this.parsePackages();

    }

    this.parsePackages= function() {
        $("#package-list").children("li").each(function(ele) {
            var id = this.children[0].id.match(/[0-9]+/);
            packages.push(new Package(thisObject, id, this));
        });
        this.sorts= new Sortable.create($('#package-list')[0],{
            handle: '.progress',
            preventOnFilter: false,
            animation: 250,
            onEnd: function (evt) {
                var order = $(evt.item).data('pid') + '|' + evt.newIndex
                $.get( '/json/package_order/' + order, indicateFinish
                    )
                    .fail(indicateFail);
    }
        });
    }

    this.deleteFinished= function() {
        indicateLoad();
        $.get( '/api/deleteFinished', function(data) {
                if (data.length > 0) {
                window.location.reload();
                } else {
                $.each(packages,function(pack) {
                    this.close();
                    });
            }
                    indicateSuccess();
        })
            .fail(indicateFail);
                }

    this.restartFailed = function () {
        indicateLoad();
        $.get( '/api/restartFailed', function(data) {
            if (data.length > 0) {
                $.each(packages,function(pack) {
                    this.close();
                });
            }
                indicateSuccess();
        })
            .fail(indicateFail);
    }

    this.initialize(url,type);
}

function Package (ui, id, ele){
    // private variables
    var linksLoaded = false;
    var thisObject;
    var buttons;
    var name;
    var password;
    var folder;

    this.initialize= function() {
        thisObject=this;
        if (!ele) {
            this.createElement();
        } else {
            jQuery.data(ele,"pid", id);
            this.parseElement();
        }

        var pname = $(ele).find('.packagename');

        buttons=$(ele).find('.buttons');
        buttons.css("opacity", 0);

        $(pname).mouseenter(function(e) {
            $(this).find('.buttons').fadeTo('fast', 1)
        });

        $(pname).mouseleave( function(e) {
            $(this).find('.buttons').fadeTo('fast', 0)
        });
    }

    this.createElement= function() {
        alert("create");
    }

    this.parseElement= function() {
        var imgs = $(ele).find('span');

        name = $(ele).find('.name');
        folder =  $(ele).find('.folder');
        password = $(ele).find('.password');

        $(imgs[3]).click(this.deletePackage);
        $(imgs[4]).click(this.restartPackage);
        $(imgs[5]).click(this.editPackage);
        $(imgs[6]).click(this.movePackage);
        $(imgs[7]).click(this.editOrder);

        $(ele).find('.packagename').click(this.toggle);
    }

    this.loadLinks = function() {
        indicateLoad();
        $.get( '/json/package/' + id, thisObject.createLinks)
            .fail(indicateFail);
    }

    this.createLinks= function(data) {
        var ul = $("#sort_children_" + id[0]);
        ul.html("");
        $.each(data.links, function(key, link) {      // data.links.each(
            link.id = link.fid;
            var li = document.createElement("li");
            $(li).css("margin-left",0);
            var pbColor = "#c37575";

            if (link.icon == 'arrow_right.png'){
                    link.icon = 'glyphicon glyphicon-arrow-right text-primary';
                    pbColor = "#758dc3";
            }
            if (link.icon == 'status_downloading.png'){
                    link.icon = 'glyphicon glyphicon-cloud-download text-primary';
                    pbColor = "#c3c175";
            }
            if (link.icon == 'status_failed.png'){
                    link.icon = 'glyphicon glyphicon-exclamation-sign text-danger';
                    pbColor = "#c37575";
            }
            if (link.icon == 'status_finished.png'){
                    link.icon = 'glyphicon glyphicon-ok text-success';
                    pbColor = "#75c375";
            }
            if (link.icon == 'status_queue.png'){
                    link.icon = 'glyphicon glyphicon-time text-info';
                    pbColor = "#c5c5c5";
            }
            if (link.icon == 'status_offline.png'){
                    link.icon = 'glyphicon glyphicon-ban-circle text-danger';
                    pbColor = "#c37575";
            }
            if (link.icon == 'status_waiting.png'){
                    link.icon = 'glyphicon glyphicon-time text-info';
                    pbColor = "#c3c175";
            }

            var html = "<span class='child_status'><span style='margin-right: 2px;' class='"+link.icon+"'></span></span>\n";
            html += "<span style='font-size: 18px; text-weight:bold'><a href='"+link.url+"'>";
            html += link.name+"</a></span><br/><div class='child_secrow' style='background-color: " + pbColor + "; margin-left: 21px; margin-bottom: 7px; border-radius: 4px;'>";
            html += "<span class='child_status' style='font-size: 12px; color:#333; padding-left: 5px;'>"+link.statusmsg+"</span>&nbsp;"+link.error+"&nbsp;";
            html += "<span class='child_status' style='font-size: 12px; color:#333;'>"+link.format_size+"</span>";
            html += "<span class='child_status' style='font-size: 12px; color:#333;'> "+link.plugin+"</span>&nbsp;&nbsp;";
            html += "<span class='glyphicon glyphicon-trash' title='{{_("Delete Link")}}' style='cursor: pointer;  font-size: 12px; color:#333;' ></span>&nbsp;&nbsp;";
            html += "<span class='glyphicon glyphicon-repeat' title='{{_("Restart Link")}}' style='cursor: pointer; font-size: 12px; color:#333;' ></span></div>";

            var div=document.createElement("div");
            $(div).attr("id","file_" + link.id);
            $(div).addClass("child");
            $(div).html(html);

            jQuery.data(li,"lid", link.id);

            li.appendChild(div);
            $(ul)[0].appendChild(li);
        });

        thisObject.registerLinkEvents();
        linksLoaded = true;
        indicateFinish();
        thisObject.toggle();
    }

    this.registerLinkEvents= function() {
        $(ele).find('.children').children('ul').children("li").each(function(child) {
            var lid = $(this).find('.child').attr('id').match(/[0-9]+/);
            var imgs = $(this).find('.child_secrow span');
            $(imgs[3]).bind('click',{ lid: lid}, function(e) {
                $.get( '/api/deleteFiles/[' + lid + "]", function() {
                    $('#file_' + lid).remove()
                })
                    .fail(indicateFail);
            });

            $(imgs[4]).bind('click',{ lid: lid},function(e) {
                $.get( '/api/restartFile/' + lid, function() {
                    var ele1 = $('#file_' + lid);
                    var imgs1 = $(ele1).find(".glyphicon");
                    $(imgs1[0]).attr( "class","glyphicon glyphicon-time text-info");
                    var spans = $(ele1).find(".child_status");
                    $(spans[1]).html("{{_("queued")}}");
                        indicateSuccess();
                })
                    .fail(indicateFail);
            });
        });
        this.sorts= new Sortable.create($(ele).find('.children').children('ul')[0],{
            handle: '.child_status',
            animation: 250,
            onEnd: function (evt) {
                var order = $(evt.item).data('lid') + '|' + evt.newIndex
                $.get( '/json/link_order/' + order, indicateFinish
                    )
                    .fail(indicateFail);
                }
        });
    }

    this.toggle = function() {
        var child = $(ele).find('.children');
        if (child.css('display') == "block") {
            $(child).fadeOut();
        } else {
            if (!linksLoaded) {
                thisObject.loadLinks();
            } else {
                $(child).fadeIn();
            }
            }
        }

    this.deletePackage= function(event) {
        indicateLoad();
        $.get( '/api/deletePackages/[' + id + "]", function() {
            $(ele).remove();
                indicateFinish();
        })
            .fail(indicateFail);

        event.stopPropagation();
        event.preventDefault();
    }

    this.restartPackage= function(event) {
        indicateLoad();
        $.get( '/api/restartPackage/' + id, function() {
            thisObject.close();
                indicateSuccess();
        })
            .fail(indicateFail);
        event.stopPropagation();
        event.preventDefault();
    }

    this.close= function() {
        var child = $(ele).find('.children');
        if (child.css('display') == "block") {
            $(child).fadeOut();
        }
        var ul = $("#sort_children_"+id);
        $(ul).html("");
        linksLoaded = false;
    }

    this.movePackage= function(event) {
        indicateLoad();
        $.get( '/json/move_package/' + ((ui.type + 1) % 2) + "/" + id, function() {
            $(ele).remove();
                indicateFinish();
        })
            .fail(indicateFail);
        event.stopPropagation();
        event.preventDefault();
    }

    this.editOrder= function(event) {
        indicateLoad();
        $.get( '/json/package/' + id, function(data){
            length=data.links.length;
            for (i=1; i <= length/2; i++){
                order = data.links[length-i].fid + '|' + (i-1);
                $.get( '/json/link_order/'+ order)
                     .fail(indicateFail);
            }
        });
        indicateFinish();
        thisObject.close();
        event.stopPropagation();
        event.preventDefault();
    }


    this.editPackage= function(event) {
        event.stopPropagation();
        event.preventDefault();
        $("#pack_form").off("submit");
        $("#pack_form").submit(thisObject.savePackage);

        $("#pack_id").val(id[0]);
        $("#pack_name").val(name.text());
        $("#pack_folder").val(folder.text());
        $("#pack_pws").val(password.text());
        $('#pack_box').modal('show');
    }

    this.savePackage= function(event) {
        $.ajax({
            url: '/json/edit_package',
            type: 'post',
            dataType: 'json',
            data: $('#pack_form').serialize()
        });
        event.preventDefault();
        name.text( $("#pack_name").val());
        folder.text( $("#pack_folder").val());
        password.text($("#pack_pws").val());
        $('#pack_box').modal('hide');
    }

    this.initialize();
}

