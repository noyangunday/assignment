/// <reference path="Utils.ts" />
/// <reference path="Context.ts" />
/// <reference path="Texture.ts" />
/*

    author: Noyan Gunday
    date: 03 feb 2019

*/

module challenge.video {

    export class Video extends Texture {
        private mFormat: number;
        private mLoaded: boolean;

        constructor(aConfig: ITextureConfig) {
            super(aConfig);
            this.mFormat = aConfig.format;
        }

        public onUpdate(aVideoElement: HTMLVideoElement) {
            var tGL: WebGLRenderingContext = Context.gl;
            if (this.mLoaded && !aVideoElement.paused) {
                this.bind(0);
                tGL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, this.mFormat, this.mFormat, WebGLRenderingContext.UNSIGNED_BYTE, aVideoElement);
            }
        }

        public onReady(aVideoElement: HTMLVideoElement) {
            var tGL: WebGLRenderingContext = Context.gl;
            this.mLoaded = true;
            // Do the initial load
            this.bind(0);
            tGL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, this.mFormat, this.mFormat, WebGLRenderingContext.UNSIGNED_BYTE, aVideoElement);
        }
    }

}
