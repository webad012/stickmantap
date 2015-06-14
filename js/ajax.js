/* global StickmanTapGame, StickmanTapDefaultConf */

function stickmanAjax(action, success_function, parameters)
{
    var localstorage = new LocalStorage();
    
    var api_url = localstorage.getData('apiUrl');
    if(!api_url)
    {
        api_url = StickmanTapDefaultConf.apiUrl;
        localstorage.setData('apiUrl', api_url);
    }
    
    api_url += "?action="+action;
    if(typeof parameters !== "undefined" && parameters !== "")
    {
        api_url += "&"+parameters;
    }
        
    $.ajax({
        url: api_url,
        dataType: 'jsonp',
        jsonp: 'callback',
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
            stickanAjaxFailure(xhr.responseText);
        }
    });
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

