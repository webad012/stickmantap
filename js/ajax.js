/* global StickmanTapGame, StickmanTapDefaultConf */

function stickmanAjax(action, success_function, parameters, error_function)
{
    if(StickmanTapGameOffline === false)
    {
        var api_url = StickmanTapDefaultConf.apiUrl;

        api_url += "?action="+action;
        if(typeof parameters !== "undefined" && parameters !== "")
        {
            api_url += "&"+parameters;
        }

        if(typeof error_function === 'undefined')
        {
            error_function = function(responseText){
                stickanAjaxFailure(responseText);
            };
        }

        $.ajax({
            url: api_url,
            dataType: 'jsonp',
            jsonp: 'callback',
            async: true,
            success: function(response){
                if(response.status === 'success')
                {
                    success_function(response);
                }
                else
                {
                    if(typeof response.message !== 'undefined')
                    {
                        stickanAjaxFailure(JSON.stringify(response.message));
                    }
                    else
                    {
                        stickanAjaxFailure(JSON.stringify(response));
                    }
                }
            },
            error: function(xhr){
                error_function(xhr.responseText);
            }
        });
    }
}

function stickanAjaxFailure(reason)
{
    if (window.confirm("There was problem with connection:\n"+reason+"\nDo you want to continue offline?")) 
    {
        StickmanTapGameOffline = true;
        StickmanTapGame.game.state.start('Game');
    }
    else
    {
        navigator.app.exitApp();
    }

//        var thisGame = this;
//        $(function () {
//            $('<div><p>There was problem with connection:</br>'
//                    +reason
//                    +'</br>Do you want to continue offline?</p></div>').dialog({
////                closeText: "hide",
////                dialogClass: "alert",
//                height: 150,
//                buttons: {
//                    "Yes": function() {
//                        $(this).remove();
//                        StickmanTapGameOffline = true;
//                        thisGame.state.start('Preload');
//                    },
//                    "Try again":  function() {
//                        $(this).remove();
//                        thisGame.checkVersion();
//                    },
//                    "No":  function() {
//                        $(this).remove();
//                        navigator.app.exitApp();
//                    }
//                }
//            });
//        });
}

