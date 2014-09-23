var sokoban = (function() {
    this.util = (function() {
        
        var EPS = 0.0001;
        
        this.AnimateParameter = function() {
            this.start = 0;
            this.end = 0;
            this.old = 0;
            this.diff = 0;
            this.speed = 0;
            this.current = 0;
            
            this.calculateTransform = function(speed) {
                if (typeof speed === 'undefined') {
                    speed = 1;
                }
                this.diff = this.end > this.start ? 1.0 : -1.0;
                this.speed = (this.end - this.start) * speed;
            };

            this.nextStep = function(delta) {
                if ((this.end - this.current) * this.diff > EPS) {
                    var step = this.speed * delta;
                    this.current += step;
                    if ((this.end - this.current) * this.diff < EPS) {
                        this.current = this.end;
                    }
                } else {
                    this.current = this.end;
                }
            };
            
            this.isContinue = function () {
                return this.end !== this.current;
            };
        };
    
        return this;
    }).call(this.util || {});
    return this;
}).call(sokoban || {});