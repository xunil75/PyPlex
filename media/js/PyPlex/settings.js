{% autoescape true %}
var SettingsUI, root;
root = this;

$(function() {
    return new SettingsUI();
});

SettingsUI = (function() {
    function a() {
        var c, e, b, d;
        general = $("#general_form_content");
        plugin = $("#plugin_form_content");
        thisObject=this;
        $("#general-menu").find("li").each(function(a) {
            $(this).click(thisObject.menuClick);
        });
        $("#plugin-menu").find("li").each(function(a) {
            $(this).click(thisObject.menuClick);
        });

        $("#general_submit").click(this.configSubmit);
        $("#plugin_submit").click(this.configSubmit);
        $("#account_add").click(function(f) {
            $("#account_box").modal('show');
            f.stopPropagation();
            f.preventDefault();
        });
        $("#account_add_button").click( this.addAccount);
        $("#account_submit").click( this.submitAccounts);
    }
    a.prototype.menuClick = function(h) {
        var c, b, g, f, d;
        d = $(this).attr('id').split("|"), c = d[0], g = d[1];
        b = $(this).text();
        f = c === "general" ? general : plugin;
        $.get( "/json/load_config/" + c + "/" + g, function(e) {
                f.html(e);
            });
    }
    a.prototype.configSubmit = function(d) {
        var c, b;
        c = $(this).attr("id").split("_")[0];
        $.ajax({
            method:"post",
            url:"/json/save_config/" + c,
            data: $("#" + c + "_form").serialize(),
            async: true,
            success: function() {
                $.bootstrapPurr('{{ _("Settings saved.")}}',{
                    offset: { amount: 10},
                    type: 'success',
                    align: 'center',
                    draggable: false
                });
                }
            })
            .fail(function() {
                $.bootstrapPurr('{{ _("Error occured.")}}',{
                    offset: { amount: 10},
                    type: 'danger',
                    align: 'center',
                    draggable: false
                });
            });
        d.stopPropagation();
        d.preventDefault();
    }
    a.prototype.addAccount = function(c) {
        $.ajax({
            method:"post",
            url:"/json/add_account",
            async: true,
            data: $("#add_account_form").serialize(),
            success: function() {
                return window.location.reload()
            }
                })
            .fail(function() {
                $.bootstrapPurr('{{ _("Error occured.")}}',{
                    offset: { amount: 10},
                    type: 'danger',
                    align: 'center',
                    draggable: false
                });
        });
        c.preventDefault();
    }
    a.prototype.submitAccounts = function(c) {
        $.ajax({
            method:"post",
            url:"/json/update_accounts",
            data: $("#account_form").serialize(),
            async: true,
            success: function() {
                return window.location.reload()
            }
                })
            .fail(function() {
                $.bootstrapPurr('{{ _("Error occured.")}}',{
                    offset: { amount: 10},
                    type: 'danger',
                    align: 'center',
                    draggable: false
                });
        });
        c.preventDefault();
    };
    return a;
})(); 
{% endautoescape %}