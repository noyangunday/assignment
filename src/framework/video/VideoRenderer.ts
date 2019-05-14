/// <reference path="Primitive.ts" />
/// <reference path="Camera.ts" />
/// <reference path="Material.ts" />
/// <reference path="Context.ts" />
/*

    author: Noyan Gunday
    date: 03 feb 2019

*/

module challenge.video {

    export interface IRenderNode {
        primitive: string;
        material: IMaterialConfig;
    }

    export interface IPlayerScene {
        camera?: ICameraConfig;
        nodes: IRenderNode[];
    }

    export class RenderNode {
        mPrimitive: Primitive;
        mMaterial: Material;
        mCamera: Camera;

        constructor(aPrimitive: Primitive, aMaterial: Material, aCamera?: Camera) {
            this.mPrimitive = aPrimitive;
            this.mMaterial = aMaterial;
            this.mCamera = aCamera;
        }

        public draw(): void {
            this.mPrimitive.bind();
            this.mMaterial.use();
            this.mPrimitive.draw();
        }
    }

    export class VideoRenderer {
        private mNodes: RenderNode[] = [];
        private mFPSCounter: Performance;
        private mRenderCallback: () => void;

        constructor(aResourceMap: IResourceMap, aConfig: IPlayerScene, aCounterCallback?: (aFPS: number) => void, aRenderCallback?: () => void) {
            var tCamera: Camera = aConfig.camera && new Camera(aConfig.camera);

            ResourceManager.map = aResourceMap;
            aConfig.nodes.forEach((aNode: IRenderNode) => {
                var tPrimitive: Primitive = <Primitive>ResourceManager.getResource(aNode.primitive, Primitive),
                    tMaterial: Material = new Material(aNode.material);
                this.mNodes.push(new RenderNode(tPrimitive, tMaterial, tCamera));
            });
            this.mFPSCounter = new Performance(aCounterCallback);

            //DESIGN-NOTE: this could be a encapsulated by a subscription system for multiple callbacks
            // e.g. module based update methods. 
            this.mRenderCallback = aRenderCallback;
        }

        public run(): void {
            var tGL: WebGLRenderingContext = Context.gl;

            //DESIGN-NOTE: if video is paused, could stop rendering

            tGL.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);

            this.mRenderCallback && this.mRenderCallback();
            this.mNodes.forEach((aNode: RenderNode) => {
                aNode.draw();
            })

            //DESIGN-NOTE: this effectively will measure the rate of animation
            // frames which is proposedly capped to VSYNC. but since some gl calls are
            // async this will never give a very accurate representation of the
            // time each draw call and texture upload take.
            this.mFPSCounter.registerTick();

            //DESIGN-NOTE: requestAnimationFrame is not supported by some (old) browsers.
            // using a timeout with desired framerate could be considered as a fallback.
	    window.requestAnimationFrame(this.run.bind(this));
        }

    }
}
