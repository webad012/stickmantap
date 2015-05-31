/* global StickmanTapGameVersion */

var StickmanTapGame = StickmanTapGame || {};
 
StickmanTapGame.CheckVersion = function(){};
 
StickmanTapGame.CheckVersion.prototype = {
 
    preload: function() {
    },
 
    create: function() {
        var localstorage = new LocalStorage();
        var api_url = localstorage.getData('apiUrl');
        if(!api_url)
        {
            api_url = 'http://localhost/stickmantap/api.php';
            localstorage.setData('apiUrl', api_url);
        }
        
        this.checkVersion(api_url);
        
//        this.state.start('Preload');
    },
    
    update: function()
    {
    },
    
    checkVersion: function(api_url)
    {
//        $.ajax({
//            type: "POST",
//            url: api_url,
//            data: {
//                action: 'GetCurrentVersion',
//                version: StickmanTapGameVersion
//            },
//            dataType: 'jsonp',
//            async: true,
//            success: function(response){
//                console.log('success');
//                console.log(response);
////                if(response.status === "success")
////                {
////                    var select_team = parentDiv.find('.select-team');
////
////                    if(response.message !== undefined)
////                    {
////                        var json_result = jQuery.parseJSON(response.message);
////                        for(var i=0; i<json_result.length; i++)
////                        {
////                            select_team.append($("<option></option>")
////                                        .attr("value",json_result[i].id)
////                                        .text(json_result[i].name)); 
////                        }
////                    }
////                }
////                else
////                {
////                    alert("failure: "+response.message);
////                }
//            },
//            error: function(xhr){
//                console.log('failure');
//                console.log(xhr.responseText);
//                console.log(this.url);
////                alert("failure: "+xhr.responseText+ " - " + this.url);
//            }
//        });
        
//        $.ajax({
//            type: "POST",
//            url: api_url,
//            data:{
//                action: 'GetCurrentVersion',
//                version: StickmanTapGameVersion
//            },
//            async:true,
//            dataType : 'jsonp',   //you may use jsonp for cross origin request
//            crossDomain:true,
//            success: function(data, status, xhr) {
//                console.log('success');
//                console.log(data);
//                console.log(status);
//                console.log(xhr);
////                alert(xhr.getResponseHeader('Location'));
//            },
//            error: function(data, status, xhr) {
//                console.log('error');
//                console.log(data);
//                console.log(status);
//                console.log(xhr.getResponseHeader('Location'));
//                console.log(xhr);
////                alert(xhr.getResponseHeader('Location'));
//            }
//        });

//        $.getJSON(api_url, 
//                    "method=mobileGetData", 
//                    function(response, status, xhr){
//                        console.log(response);
//                        console.log(status);
//                        console.log(xhr);
////                        for(var key in response[0]){
////                            alert(key + ": " + response[0][key]);
////                        }
//                    }
//        );

        xmlhttp.onreadystatechange=function()
            {
                console.log(xmlhttp.responseText);
//            if (xmlhttp.readyState==4 && xmlhttp.status==200)
//              {
//              document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
//              }
            }
          xmlhttp.open("GET",api_url,true);
          xmlhttp.send();
    }
};