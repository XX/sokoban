var sokoban = (function() {
    this.util = (function() {
        
        this.Animation = function() {
            this.beginAnimate = true;
            this.elapsedTime = 0;
            this.lastTime = 0;
            this.speed = 1;
            
            this.rx = new sokoban.util.AnimateParameter();
            this.ry = new sokoban.util.AnimateParameter();
            this.rz = new sokoban.util.AnimateParameter();
            
            this.tx = new sokoban.util.AnimateParameter();
            this.ty = new sokoban.util.AnimateParameter();
            this.tz = new sokoban.util.AnimateParameter();
            
            this.animate = function() {
                this.calculateTime();

                if (this.beginAnimate) {
                    this.beginAnimate = false;
                } else {
                    this.tx.nextStep(this.elapsedTime);
                    this.ty.nextStep(this.elapsedTime);
                    this.tz.nextStep(this.elapsedTime);

                    this.rx.nextStep(this.elapsedTime);
                    this.ry.nextStep(this.elapsedTime);
                    this.rz.nextStep(this.elapsedTime);
                }
            };
            
            this.isPlayback = function () {
                return this.tx.isContinue() ||
                        this.ty.isContinue() ||
                        this.tz.isContinue() ||
                        this.rx.isContinue() ||
                        this.ry.isContinue() ||
                        this.rz.isContinue();
            };
            
            this.calculateTime = function() {
                var nowTime = new Date().getTime();
                if (this.lastTime !== 0) {
                    this.elapsedTime = nowTime - this.lastTime;
                }
                this.lastTime = nowTime;
            };
            
            this.calculateTransform = function (speed) {
                speed = speed || this.speed;
                
                this.tx.calculateTransform(speed);
                this.ty.calculateTransform(speed);
                this.tz.calculateTransform(speed);

                this.rx.calculateTransform(speed);
                this.ry.calculateTransform(speed);
                this.rz.calculateTransform(speed);
            };
        };
    
        return this;
    }).call(this.util || {});
    return this;
}).call(sokoban || {});