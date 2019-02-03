/*

    2019, V-Nova

    author: Noyan Gunday
    date: 03 feb 2019

*/

module vnova.video {

    export class Utils {
        public static randIntRange(aRange: number[]): number {
            return Math.floor(Math.random() * (aRange[1] - aRange[0] + 1)) + aRange[0];
        }

        //DESIGN-NOTE: In the usecase of this method within this example, it creates a 1920x1080
        // byte array, fills first 1000 bits with 50 and shuffles for randomisation. 
        // this effectively is a texture friendly way of the spec definition; creating two byte arrays 
        // (1920x1080) and assigning 50 to 1000 unique random locations within. 
        public static generateBinaryNoise(aValue: number, aCount: number, aSize: number): Uint8Array {
            var tProcessData: Uint8Array = new Uint8Array(aSize),
                tTarget: number;
            
            // fill first n elements with value
            tProcessData.fill(aValue, 0, aCount);

            // and shuffle to randomise
            for (var i = 0; i < aCount; i++) {
                if ((tTarget = this.randIntRange([0, aSize])) !== i) {
                    tProcessData[i] += tProcessData[tTarget];
                    tProcessData[tTarget] = tProcessData[i] - tProcessData[tTarget];
                    tProcessData[i] = tProcessData[i] - tProcessData[tTarget];
                }
            }

            return tProcessData;
        }

        public static makeOrtho(aLeft: number, aRight: number, aBottom: number, aTop: number, aNear: number, aFar:number): number[] {
            return [
                2.0 / (aRight - aLeft), 0.0,                    0.0,                    -(aRight + aLeft) / (aRight - aLeft),
                0.0,                    2.0 / (aTop - aBottom), 0.0,                    -(aTop + aBottom) / (aTop - aBottom),
                0.0,                    0.0,                    2.0 / (aNear - aFar),   -(aFar + aNear) / (aFar - aNear),
                0.0,                    0.0,                    0.0,                     1.0
            ];
        }
    }

    export class Performance {

        private mLastUpdate: number;
        private mFPS: number = 0;
        private mUpdateCallback: (aFPS: number) => void;

        constructor(aUpdateCallback?: (aFPS: number) => void) {
            this.mLastUpdate = window.performance.now();
            this.mUpdateCallback = aUpdateCallback;
        }

        public registerTick(): void {
            //DESIGN-NOTE: window.performance is not supported by some (old) browsers.
            // it is possible to fall back to Date.now() or similar methods.
            var tNow: number = window.performance.now();
            this.mFPS++;
            if (tNow - this.mLastUpdate >= 1000) {
                this.mUpdateCallback && this.mUpdateCallback(this.mFPS);
                this.mLastUpdate = tNow;
                this.mFPS = 0;
            }
        }

    }
}