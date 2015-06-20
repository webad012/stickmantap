var LocalStorage = function () {
    this.setData = function(name, data)
    {
        localStorage.setItem(name, data);
        var lastAction = Math.floor(Date.now() / 1000);
        localStorage.setItem('lastAction', lastAction);
    };
    
    this.getData = function(name)
    {
        var data = localStorage.getItem(name);
        return data;
    };
    
    this.factoryReset = function()
    {
        localStorage.clear();
    };
};