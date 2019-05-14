/// <reference path="Utils.ts" />
/*

    author: Noyan Gunday
    date: 03 feb 2019

*/
module challenge.video {

    //DESIGN-NOTE: I implemented this camera class to accomodate Orthographic projection only
    // as perspective was not required. But since the effect is so simple, this wasn't used
    // in the end. keeping this in just for the sake of demonstration.
    export interface ICameraConfig {
        id: string;
        width: number;
        height: number;
    }

    export class Camera {

        private mMatrix: Float32Array;
        private mId: string;

        constructor(aConfig: ICameraConfig) {
            this.mMatrix = new Float32Array(Utils.makeOrtho(0.0, aConfig.width, aConfig.height, 0.0, 0.0, 1.0));
            this.mId = aConfig.id;
        }

        public get id(): string {
            return this.mId;
        }

        public get matrix(): Float32Array {
            return this.mMatrix;
        }
    }

}
