var sokoban = (function() {
    this.util = (function() {
                
        this.ModelManager = (function() {
            
            var entry = function() {
            };
    
            entry.resourcePath = "";
            
            entry.loadData = function(path, loadedDataHandler) {
                var request = new XMLHttpRequest();
                request.open("GET", this.resourcePath + '/' + path);
                request.onreadystatechange = function() {
                    if (request.readyState === 4) {
                        loadedDataHandler(JSON.parse(request.responseText));
                    }
                };
                request.send();
            };
            
            return entry;
        })();
    
        return this;
    }).call(this.util || {});
    return this;
}).call(sokoban || {});