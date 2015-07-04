function SessionStorage()
{
//    this.setData = function(name, data)
//    {
//        sessionStorage.setItem(name, data);
//    };
//    
//    this.getData = function(name)
//    {
//        var data = sessionStorage.getItem(name);
//        return data;
//    };
}

SessionStorage.setData = function(name, data)
{
    localStorage.setItem(name, data);
};

SessionStorage.getData = function(name)
{
    var data = localStorage.getItem(name);
    return data;
};
