/// <reference path="Utils.ts" />
/// <reference path="Context.ts" />
/*

    2019, V-Nova

    author: Noyan Gunday
    date: 03 feb 2019

*/

module vnova.video {

    export class Video extends Texture {
        private mVideoElement: HTMLVideoElement;
        private mFormat: number;
        private mLoaded: boolean;

        constructor(aConfig: ITextureConfig) {
            var tVideo: HTMLVideoElement;
            super(aConfig);
            //DESIGN-NOTE: This class itself creating and owning the Video element
            // feels contradicting with the rest of the framework design. The HTMLVideoElement
            // instance could be owned and handed-over by either config or an update callback.
            // Was not implemented for this example.
            tVideo = this.mVideoElement = document.createElement("video");

            tVideo.autoplay = true;
            tVideo.loop = true;
            tVideo.muted = true;
            tVideo.crossOrigin = "anonymous";
            tVideo.oncanplay = this.onReady.bind(this);

            this.mLoaded = false;
            
            this.mFormat = aConfig.format;
        }

        public get videoElement(): HTMLVideoElement {
            return this.mVideoElement;
        }

        public updateTexture() {
            var tGL: WebGLRenderingContext = Context.gl;
            if (this.mLoaded && !this.mVideoElement.paused) {
                this.bind(0);
                tGL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, this.mFormat, this.mFormat, WebGLRenderingContext.UNSIGNED_BYTE, this.mVideoElement);
            }
        }

        private onReady() {
            var tGL: WebGLRenderingContext = Context.gl;
            this.mLoaded = true;
            // Do the initial load
            this.bind(0);
            tGL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, this.mFormat, this.mFormat, WebGLRenderingContext.UNSIGNED_BYTE, this.mVideoElement);

        }
    }

}