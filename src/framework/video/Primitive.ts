/// <reference path="Context.ts" />
/// <reference path="Resource.ts" />
/*

    2019, V-Nova

    author: Noyan Gunday
    date: 03 feb 2019

*/

module vnova.video {

    export interface IPrimitiveData extends IResourceConfig {
        vertices: number[];
        indices: number[];
    }

    export class Primitive extends Resource {
        private mVertexBuffer: WebGLBuffer;
        private mIndexBuffer: WebGLBuffer;
        private mDrawSize: number;

        constructor(aConfig: IPrimitiveData) {
            var tGL: WebGLRenderingContext = Context.gl;
            super(aConfig);
            this.mVertexBuffer = tGL.createBuffer();
            this.mIndexBuffer = tGL.createBuffer();

            this.bind();

            tGL.bufferData(WebGLRenderingContext.ARRAY_BUFFER, new Float32Array(aConfig.vertices), WebGLRenderingContext.STATIC_DRAW);
            tGL.bufferData(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(aConfig.indices), WebGLRenderingContext.STATIC_DRAW);

            this.mDrawSize = aConfig.indices.length;
        }

        public bind(): void {
            var tGL: WebGLRenderingContext = Context.gl;
            tGL.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, this.mVertexBuffer);
            tGL.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer);
        }

        public draw(): void {
            var tGL: WebGLRenderingContext = Context.gl;
            tGL.drawElements(WebGLRenderingContext.TRIANGLES, this.mDrawSize, WebGLRenderingContext.UNSIGNED_SHORT, 0);
        }
    }
}