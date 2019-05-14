/// <reference path="Resource.ts" />
/// <reference path="Texture.ts" />
/// <reference path="Shader.ts" />
/*

    author: Noyan Gunday
    date: 03 feb 2019

*/

module challenge.video {

    //DESIGN-NOTE: as the "framework" module is intended to look fully adjustable
    // very low level configuration is exposed to dev. Things like vertexStructure
    // could cause friction for the dev and could ideally be encapsulated and harcoded
    // with a use-case orientated opaque structure.
    export interface IMaterialConfig {
        shader: string;
        videoTextures?: string[];
        dataTextures?: string[];
        uniforms?: FloatUniform[];
        vertexStructure: IVertexConfig[];
    }

    export class Material {
        private mShader: Shader;
        private mTextures: Texture[] = [];
        private mAttribLocations: number[] = [];
        private mUniforms: FloatUniform[];

        constructor(aConfig: IMaterialConfig) {
            var tStride: number = 0,
                tOffset: number = 0;

            this.mShader = <Shader>ResourceManager.getResource(aConfig.shader, Shader);
            this.mUniforms = aConfig.uniforms;

            // resolve textures
            aConfig.videoTextures && aConfig.videoTextures.forEach((aName: string) => {
                this.mTextures.push(<Video>ResourceManager.getResource(aName, Video));
            });
            aConfig.dataTextures && aConfig.dataTextures.forEach((aName: string) => {
                this.mTextures.push(<DataTexture>ResourceManager.getResource(aName, DataTexture));
            });
            this.mTextures.forEach((aTexture: Texture, aIndex: number) => {
                this.mShader.bindTextureUniform(aTexture.id, aIndex);
            });

            // resolve attributes
            aConfig.vertexStructure.forEach((aAttribute: IVertexConfig) => {
                tStride += aAttribute.size;
            });
            tStride *= 4;
            aConfig.vertexStructure.forEach((aAttribute: IVertexConfig) => {
                this.mAttribLocations.push(this.mShader.bindAttribute(aAttribute, tStride, tOffset));
                tOffset += aAttribute.size * 4;
            });
        }

        public use(): void {
            this.mShader.bind();
            this.mUniforms.forEach((aUniform: FloatUniform) => {
                if (aUniform.updated) {
                    this.mShader.updateUniform(aUniform);
                }
            });
            this.mTextures.forEach((aTexture: Texture, aIndex: number) => {
                aTexture.bind(aIndex);
            });
        }
    }
}
