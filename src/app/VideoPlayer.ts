/// <reference path="../framework/video/VideoRenderer.ts" />
/// <reference path="../framework/video/Video.ts" />
/*

    2019, V-Nova

    author: Noyan Gunday
    date: 03 feb 2019

*/

//DESIGN-NOTE: The unit tests are not implemented within the scope of this
// example but each framework module should be covered.

module vnova.app {

    interface IEffectConfig {
        width: number;
        height: number;
        modifier: number;
        count: number;
    }

    export class VideoPlayer {

        //DESIGN-NOTE: this configuration could be moved into a JSON file
        private static sEffectConfig: IEffectConfig = {
            width: 1920,
            height: 1080,
            modifier: 50,
            count: 1000
        };

        private static sResources: video.IResourceMap = {
            map: {
                videoPrimitive: <video.IResourceConfig>{
                    id: "videoPrimitive",
                                //x         //y     //u     //v
                    vertices:  [1.0,        1.0,    1.0,    0.0,
                               -1.0,        1.0,    0.0,    0.0,
                               -1.0,       -1.0,    0.0,    1.0,
                                1.0,       -1.0,    1.0,    1.0],
                    indices:   [0, 1, 2, 0, 2, 3]
                },
                videoShader: <video.IResourceConfig>{
                    id: "videoShader",
                    //DESIGN-NOTE: This shader has alot of room for optimisation. It's
                    // very basic and verbose in its current form.
                    vertexShader:
                    `
                        precision mediump float;
                        attribute vec2 pos;
                        attribute vec2 texCoord;
                        varying vec2 tex;
                        
                        void main()
                        {
                            gl_Position =  vec4(pos, 0.0, 1.0);
                            tex = texCoord;
                        }
                    `,
                    fragmentShader:
                    `
                        precision mediump float;

                        const vec2 effectStep = vec2(1.0/1920.0, 1.0/1080.0);
                        uniform sampler2D video;
                        uniform sampler2D effectTexture;
                        uniform float effectScale;
                        varying vec2 tex;

                        //DESIGN-NOTE: applying a simple custom kernel for this example
                        // when the size between video texture and effect texture is greater than 2.
                        // A smarter convolution based image rescaling technique
                        // could be used here. also the kernel could be provided as a uniform
                        // from client-side for better configurability.

                        const mat3 gauss = mat3(
                            1.0/16.0, 1.0/8.0, 1.0/16.0,
                            1.0/8.0,  1.0/4.0, 1.0/8.0,
                            1.0/16.0, 1.0/8.0, 1.0/16.0
                        );

                        const mat3 edge = mat3(
                            -1.0, -1.0, -1.0,
                            -1.0,  8.0, -1.0,
                            -1.0, -1.0, -1.0
                        );

                        const mat3 xSteps = mat3(
                            -effectStep.x,  0.0, effectStep.x,
                            -effectStep.x,  0.0, effectStep.x,
                            -effectStep.x,  0.0, effectStep.x
                        );
                        const mat3 ySteps = mat3(
                            -effectStep.y, -effectStep.y, -effectStep.y,
                             0.0,           0.0,           0.0,
                             effectStep.y,  effectStep.y,  effectStep.y
                        );

                        vec4 convolve(sampler2D sampler, mat3 kernel, vec2 uv)
                        {
                            vec4 texel = vec4(0.0, 0.0, 0.0, 0.0);

                            //DESIGN-NOTE: this bit could perform a bit better with loop unwinding
                            for (int i = 0; i < 3; i++)
                            {
                                for (int j = 0; j < 3; j++)
                                {
                                    texel += texture2D( sampler, uv + vec2( xSteps[i][j], ySteps[i][j] ) ) * vec4( kernel[i][j] );
                                }
                            }
                            return texel;
                        }

                        void main()
                        {
                            //DESIGN-NOTE: It is not ideal to have this branching in this shader.
                            // I am keeping it this way for the sake of this demo. also, the edge detector
                            // is not part of the spec, was in place for a test, but I decided to keep it.
    
                            vec4 texel;
                            texel = (tex.x <= 0.5) ? texture2D(video, tex) : convolve(video, edge, tex);
                            texel += (effectScale <= 0.5) ? vec4(convolve(effectTexture, gauss, tex).rgb, 0.0) : vec4(texture2D(effectTexture, tex).rgb, 0.0);
                            gl_FragColor = texel;
                        }
                    `
                },
                video: <video.IResourceConfig> {
                    id: "video",
                    format: WebGLRenderingContext.RGB
                },
                effectTexture: <video.IResourceConfig> {
                    id: "effectTexture",
                    format: WebGLRenderingContext.LUMINANCE,
                    width: VideoPlayer.sEffectConfig.width,
                    height: VideoPlayer.sEffectConfig.height
                }
            }
        };

        private static sScene: video.IPlayerScene = {
            nodes: [{
                primitive: "videoPrimitive",
                material: {
                    shader: "videoShader",
                    videoTextures: [
                        "video"
                    ],
                    dataTextures: [
                        "effectTexture"
                    ],
                    vertexStructure: [
                        {
                            id: "pos",
                            size: 2
                        }, {
                            id: "texCoord",
                            size: 2
                        }
                    ]
                }
            }]
        };

        private mFramework: video.VideoRenderer;
        private mVideo: video.Video;
        private mCanvas: HTMLCanvasElement;
        private mEffectVideoRatio: video.FloatUniform;
        private mPlayIcon: HTMLImageElement;
        private mVideoElement: HTMLVideoElement;

        constructor (aVideoSource: string) {
            var tTextureConfig: video.IDataTextureConfig = <video.IDataTextureConfig>VideoPlayer.sResources.map["effectTexture"],
                tVideoElement: HTMLVideoElement;
            
            tTextureConfig.data = new Uint8Array(vnova.video.Utils.generateBinaryNoise(
                VideoPlayer.sEffectConfig.modifier,
                VideoPlayer.sEffectConfig.count,
                VideoPlayer.sEffectConfig.width * VideoPlayer.sEffectConfig.height
            ));

            this.mEffectVideoRatio = new video.FloatUniform({
                name: "effectScale",
                initialValue: 0
            });
            
            this.mCanvas = <HTMLCanvasElement>document.getElementById("canvas");

            this.mVideoElement = document.createElement("video");

            this.mVideoElement.autoplay = true;
            this.mVideoElement.loop = true;
            this.mVideoElement.muted = true;
            this.mVideoElement.setAttribute("crossOrigin", "anonymous");
            this.mVideoElement.onloadedmetadata = this.onVideoSizeKnown.bind(this);

            // Modify config
            VideoPlayer.sScene.nodes[0].material.uniforms = [this.mEffectVideoRatio];

            this.mFramework = new video.VideoRenderer(
                VideoPlayer.sResources,
                VideoPlayer.sScene,
                this.onFPSCounterUpdate.bind(this),
                this.onRenderFrame.bind(this));
            this.mPlayIcon = <HTMLImageElement>document.getElementById("playIcon");
            
            //DESIGN-NOTE: it's not good practice to get this resource this way and
            // resource manager should be invisible to this layer. Need this for video
            // texture updates but this could've been solved with some signal mechanism
            // or internally by the renderer itself.
            this.mVideo = <video.Video>video.ResourceManager.getResource("video", video.Video);

            this.mVideoElement.oncanplay = this.onVideoReady.bind(this);

            this.mPlayIcon.onclick = this.mCanvas.onclick = this.onCanvasClick.bind(this);
            window.onresize = this.onSizeChanged.bind(this)

            this.mVideoElement.src = aVideoSource;

            this.mFramework.run();
        }

        private test: number = 0;

        private onCanvasClick(): void {
            var tVideoElement: HTMLVideoElement = this.mVideoElement;
            if (!tVideoElement.paused) {
                tVideoElement.pause();
                this.mPlayIcon.style.visibility = "visible";
            } else {
                tVideoElement.play();
                this.mPlayIcon.style.visibility = "hidden";
            }
        }

        private onSizeChanged(): void {
            {
                var tVideoElement: HTMLVideoElement = this.mVideoElement,
                    tVideoAspect: number = tVideoElement.videoWidth / tVideoElement.videoHeight,
                    tHeight: number = Math.min(tVideoElement.videoHeight, window.innerHeight) - 50,
                    tWidth: number = tHeight * tVideoAspect;

                this.mPlayIcon.style.left = [((tWidth - this.mPlayIcon.width)/2).toString(), "px"].join("");
                this.mPlayIcon.style.top = [((tHeight - this.mPlayIcon.height)/2).toString(), "px"].join("");

                this.mCanvas.width = tWidth;
                this.mCanvas.height = tHeight;
                video.Context.gl.viewport(0.0, 0.0, tWidth, tHeight);
            }
        }

        private onVideoSizeKnown(): void {
            var tVideoElement: HTMLVideoElement = this.mVideoElement;
            this.mEffectVideoRatio.value = tVideoElement.videoWidth / VideoPlayer.sEffectConfig.width;
            this.onSizeChanged();
        }

        private onRenderFrame(): void {
            this.mVideo.onUpdate(this.mVideoElement);
        }

        private onVideoReady(): void {
            this.mVideo.onReady(this.mVideoElement);
            if (this.mVideoElement.paused) {
                this.mPlayIcon.style.visibility = "visible";
            }
        }

        private onFPSCounterUpdate(aFPS: number): void {
            document.getElementById("fps").innerHTML = [" FPS: ", aFPS.toString()].join(" ");
        }

    }

}
