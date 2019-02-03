/// <reference path="Resource.ts" />
/// <reference path="Context.ts" />
/*

    2019, V-Nova

    author: Noyan Gunday
    date: 03 feb 2019

*/

module vnova.video {

    export interface ITextureConfig extends IResourceConfig {
        format: number;
    }

    export interface IDataTextureConfig extends ITextureConfig {
        width: number;
        height: number;
        data: Uint8Array;
    }

    export class Texture extends Resource {
        private mTextureObject: WebGLTexture;

        constructor(aConfig: ITextureConfig) {
            var tGL: WebGLRenderingContext = Context.gl;
            super(aConfig);
            this.mTextureObject = tGL.createTexture();
            this.bind(0);

            //DESIGN-NOTE: These parameters could be configurable within the material definition.
            // Also, probably it's wise to review the use of Non-Power-Of-Two textures or have a
            // fallback path when the platform is not WebGL2 and the textures are NPOT.
            // For this example I just tried to avoid use of mip-maps.
            tGL.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_T, WebGLRenderingContext.CLAMP_TO_EDGE);
            tGL.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_S, WebGLRenderingContext.CLAMP_TO_EDGE);
            tGL.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, WebGLRenderingContext.LINEAR);
            tGL.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.LINEAR);
        }

        public bind(aTexUnit: number): void {
            var tGL: WebGLRenderingContext = Context.gl;
            tGL.activeTexture(WebGLRenderingContext.TEXTURE0 + aTexUnit);
            tGL.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.mTextureObject);
        }
    }

    export class DataTexture extends Texture {
        constructor(aConfig: IDataTextureConfig) {
            var tGL: WebGLRenderingContext = Context.gl;
            super(aConfig);
            tGL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, aConfig.format, aConfig.width, aConfig.height, 0, aConfig.format, WebGLRenderingContext.UNSIGNED_BYTE, aConfig.data);
        }
    }
}