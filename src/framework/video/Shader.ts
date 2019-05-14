/// <reference path="Resource.ts" />
/// <reference path="Context.ts" />
/// <reference path="Camera.ts" />
/*

    author: Noyan Gunday
    date: 03 feb 2019

*/

module challenge.video {

    //DESIGN-NOTE: At the moment the shaders work as a single piece of source code.
    // For better configurability; shaders could be designed as a set of meta definitions
    // which combines into a larger shader to achieve a combinable material system.
    // e.g:
    // config = [{uniforms0, varyings0, vertexShaderModifier0, fragmentShaderModifier0}, ... {n}]
    // which effectively combines into a shader depending on the config:
    // e.g vertex shader:
    //  uniforms[0]...
    //  uniforms[n]
    //  varyings[0]...
    //  varyings[n]
    //  "main() {
    //    vec4 finalPos = vertexPos;
    //    vertexShaderModifier[0](finalPos) ... 
    //    vertexShaderModifier[n](finalPos)
    //    gl_Position = MVP * finalPos;
    //  }""
    // and fragment shader works with the same logic but the modifiers modify the final frag colour instead.
    export interface IShaderConfig extends IResourceConfig {
        vertexShader: string;
        fragmentShader: string;
    }

    export interface IVertexConfig {
        id: string;
        size: number; // number of dimensions for this attribute (not to be confused with size in bytes)
    };

    export interface IUniformFloatConfig {
        name: string;
        initialValue: number;
    }

    /* reactive float uniform. provides an encapsulation
       for a uniform value. updated within the shader only when changed */

    //DESIGN-NOTE: this class could be designed in a way to accomodate different
    // uniform types such as float arrays or matrices. not implemented
    // as wasn't necessary for this example.
    export class FloatUniform {
        private mValue: number;
        private mName: string;
        private mUpdated: boolean;

        constructor(aConfig: IUniformFloatConfig) {
            this.mUpdated = true;
            this.mValue = aConfig.initialValue;
            this.mName = aConfig.name;
        }

        public get updated(): boolean {
            return this.mUpdated;
        }

        public get name(): string {
            return this.mName;
        }

        public set value(aValue: number) {
            this.mValue = aValue;
            this.mUpdated = true;
        };

        public get value(): number {
            this.mUpdated = false;
            return this.mValue;
        }
    }
    
    export class Shader extends Resource {

        private mProgram: WebGLProgram;
        
        constructor(aConfig: IShaderConfig) {
            var tGL: WebGLRenderingContext = Context.gl,
            tShaders: WebGLShader[] = [tGL.createShader(WebGLRenderingContext.VERTEX_SHADER),
                                       tGL.createShader(WebGLRenderingContext.FRAGMENT_SHADER)],
            tSources: string[] = [aConfig.vertexShader, aConfig.fragmentShader];

            super(aConfig);

            this.mProgram = tGL.createProgram();

            tShaders.forEach((tShader: WebGLShader, tIndex: number) => {
                tGL.shaderSource(tShader, tSources[tIndex]);
                tGL.compileShader(tShader);
                tGL.attachShader(this.mProgram, tShader);
                console.log (tGL.getShaderInfoLog(tShader))
            });
            
            tGL.linkProgram(this.mProgram);
            tGL.useProgram(this.mProgram);

            //DESIGN-NOTE: A check for the status of the program (shaders complied successfully
            // and program is linked) could be done here. The framework should handle
            // the failure either by a fallback path or warn the dev.
        }

        public bind(): void {
            var tGL: WebGLRenderingContext = Context.gl;
            tGL.useProgram(this.mProgram);
        }

        public updateUniform(aUniform: FloatUniform) {
            var tGL: WebGLRenderingContext = Context.gl;
            tGL.uniform1f(tGL.getUniformLocation(this.mProgram, aUniform.name), aUniform.value);
        }

        public bindTextureUniform(aUniformName: string, aLocation: number): void {
            var tGL: WebGLRenderingContext = Context.gl;
            tGL.uniform1i(tGL.getUniformLocation(this.mProgram, aUniformName), aLocation);
        }

        public bindAttribute(aAttribute: IVertexConfig, aStride: number, aOffet: number): number {
            var tGL: WebGLRenderingContext = Context.gl,
                tLocation: number = tGL.getAttribLocation(this.mProgram, aAttribute.id);
            tGL.enableVertexAttribArray(tLocation);
            tGL.vertexAttribPointer(tLocation, aAttribute.size, WebGLRenderingContext.FLOAT, false, aStride, aOffet);
            return tLocation;
        }

        public bindCameraUniform(aCamera: Camera): void {
            var tGL: WebGLRenderingContext = Context.gl;
            tGL.uniformMatrix4fv(tGL.getUniformLocation(this.mProgram, aCamera.id), true, aCamera.matrix);
        }
    }
}
