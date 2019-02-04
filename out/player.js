var vnova;
(function (vnova) {
    var video;
    (function (video) {
        var Resource = (function () {
            function Resource(aConfig) {
                this.mId = aConfig.id;
            }
            Object.defineProperty(Resource.prototype, "id", {
                get: function () {
                    return this.mId;
                },
                enumerable: true,
                configurable: true
            });
            return Resource;
        }());
        video.Resource = Resource;
        var ResourceManager = (function () {
            function ResourceManager() {
            }
            Object.defineProperty(ResourceManager, "map", {
                set: function (aResourceMap) {
                    this.sResourceMap = aResourceMap;
                },
                enumerable: true,
                configurable: true
            });
            ResourceManager.getResource = function (aName, aResConst) {
                var tResource = ResourceManager.sResources.items[aName];
                if (tResource) {
                    return tResource;
                }
                tResource = new aResConst(ResourceManager.sResourceMap.map[aName]);
                ResourceManager.sResources.items[aName] = tResource;
                return tResource;
            };
            ResourceManager.sResources = { items: {} };
            return ResourceManager;
        }());
        video.ResourceManager = ResourceManager;
    })(video = vnova.video || (vnova.video = {}));
})(vnova || (vnova = {}));
var vnova;
(function (vnova) {
    var video;
    (function (video) {
        var Context = (function () {
            function Context() {
            }
            Object.defineProperty(Context, "gl", {
                get: function () {
                    var tCanvas = document.getElementById("canvas"), tContext;
                    if (!Context.sGLContext) {
                        try {
                            for (var i = 0; i < 4; i++) {
                                tContext = tCanvas.getContext(["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"][i], { alpha: false });
                                if (tContext)
                                    break;
                            }
                            if (tContext) {
                                tContext.clearColor(0.0, 0.0, 0.0, 1.0);
                                tContext.enable(WebGLRenderingContext.DEPTH_TEST);
                                tContext.depthFunc(WebGLRenderingContext.LEQUAL);
                            }
                            Context.sGLContext = tContext;
                        }
                        catch (e) {
                            Context.sGLContext = null;
                        }
                    }
                    return Context.sGLContext;
                },
                enumerable: true,
                configurable: true
            });
            return Context;
        }());
        video.Context = Context;
    })(video = vnova.video || (vnova.video = {}));
})(vnova || (vnova = {}));
var vnova;
(function (vnova) {
    var video;
    (function (video) {
        var Utils = (function () {
            function Utils() {
            }
            Utils.randIntRange = function (aRange) {
                return Math.floor(Math.random() * (aRange[1] - aRange[0] + 1)) + aRange[0];
            };
            Utils.generateBinaryNoise = function (aValue, aCount, aSize) {
                var tProcessData = new Uint8Array(aSize), tTarget;
                tProcessData.fill(aValue, 0, aCount);
                for (var i = 0; i < aCount; i++) {
                    if ((tTarget = this.randIntRange([0, aSize])) !== i) {
                        tProcessData[i] += tProcessData[tTarget];
                        tProcessData[tTarget] = tProcessData[i] - tProcessData[tTarget];
                        tProcessData[i] = tProcessData[i] - tProcessData[tTarget];
                    }
                }
                return tProcessData;
            };
            Utils.makeOrtho = function (aLeft, aRight, aBottom, aTop, aNear, aFar) {
                return [
                    2.0 / (aRight - aLeft), 0.0, 0.0, -(aRight + aLeft) / (aRight - aLeft),
                    0.0, 2.0 / (aTop - aBottom), 0.0, -(aTop + aBottom) / (aTop - aBottom),
                    0.0, 0.0, 2.0 / (aNear - aFar), -(aFar + aNear) / (aFar - aNear),
                    0.0, 0.0, 0.0, 1.0
                ];
            };
            return Utils;
        }());
        video.Utils = Utils;
        var Performance = (function () {
            function Performance(aUpdateCallback) {
                this.mFPS = 0;
                this.mLastUpdate = window.performance.now();
                this.mUpdateCallback = aUpdateCallback;
            }
            Performance.prototype.registerTick = function () {
                var tNow = window.performance.now();
                this.mFPS++;
                if (tNow - this.mLastUpdate >= 1000) {
                    this.mUpdateCallback && this.mUpdateCallback(this.mFPS);
                    this.mLastUpdate = tNow;
                    this.mFPS = 0;
                }
            };
            return Performance;
        }());
        video.Performance = Performance;
    })(video = vnova.video || (vnova.video = {}));
})(vnova || (vnova = {}));
var vnova;
(function (vnova) {
    var video;
    (function (video) {
        var Camera = (function () {
            function Camera(aConfig) {
                this.mMatrix = new Float32Array(video.Utils.makeOrtho(0.0, aConfig.width, aConfig.height, 0.0, 0.0, 1.0));
                this.mId = aConfig.id;
            }
            Object.defineProperty(Camera.prototype, "id", {
                get: function () {
                    return this.mId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Camera.prototype, "matrix", {
                get: function () {
                    return this.mMatrix;
                },
                enumerable: true,
                configurable: true
            });
            return Camera;
        }());
        video.Camera = Camera;
    })(video = vnova.video || (vnova.video = {}));
})(vnova || (vnova = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vnova;
(function (vnova) {
    var video;
    (function (video) {
        ;
        var FloatUniform = (function () {
            function FloatUniform(aConfig) {
                this.mUpdated = true;
                this.mValue = aConfig.initialValue;
                this.mName = aConfig.name;
            }
            Object.defineProperty(FloatUniform.prototype, "updated", {
                get: function () {
                    return this.mUpdated;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FloatUniform.prototype, "name", {
                get: function () {
                    return this.mName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FloatUniform.prototype, "value", {
                get: function () {
                    this.mUpdated = false;
                    return this.mValue;
                },
                set: function (aValue) {
                    this.mValue = aValue;
                    this.mUpdated = true;
                },
                enumerable: true,
                configurable: true
            });
            ;
            return FloatUniform;
        }());
        video.FloatUniform = FloatUniform;
        var Shader = (function (_super) {
            __extends(Shader, _super);
            function Shader(aConfig) {
                var _this = this;
                var tGL = video.Context.gl, tShaders = [tGL.createShader(WebGLRenderingContext.VERTEX_SHADER),
                    tGL.createShader(WebGLRenderingContext.FRAGMENT_SHADER)], tSources = [aConfig.vertexShader, aConfig.fragmentShader];
                _super.call(this, aConfig);
                this.mProgram = tGL.createProgram();
                tShaders.forEach(function (tShader, tIndex) {
                    tGL.shaderSource(tShader, tSources[tIndex]);
                    tGL.compileShader(tShader);
                    tGL.attachShader(_this.mProgram, tShader);
                    console.log(tGL.getShaderInfoLog(tShader));
                });
                tGL.linkProgram(this.mProgram);
                tGL.useProgram(this.mProgram);
            }
            Shader.prototype.bind = function () {
                var tGL = video.Context.gl;
                tGL.useProgram(this.mProgram);
            };
            Shader.prototype.updateUniform = function (aUniform) {
                var tGL = video.Context.gl;
                tGL.uniform1f(tGL.getUniformLocation(this.mProgram, aUniform.name), aUniform.value);
            };
            Shader.prototype.bindTextureUniform = function (aUniformName, aLocation) {
                var tGL = video.Context.gl;
                tGL.uniform1i(tGL.getUniformLocation(this.mProgram, aUniformName), aLocation);
            };
            Shader.prototype.bindAttribute = function (aAttribute, aStride, aOffet) {
                var tGL = video.Context.gl, tLocation = tGL.getAttribLocation(this.mProgram, aAttribute.id);
                tGL.enableVertexAttribArray(tLocation);
                tGL.vertexAttribPointer(tLocation, aAttribute.size, WebGLRenderingContext.FLOAT, false, aStride, aOffet);
                return tLocation;
            };
            Shader.prototype.bindCameraUniform = function (aCamera) {
                var tGL = video.Context.gl;
                tGL.uniformMatrix4fv(tGL.getUniformLocation(this.mProgram, aCamera.id), true, aCamera.matrix);
            };
            return Shader;
        }(video.Resource));
        video.Shader = Shader;
    })(video = vnova.video || (vnova.video = {}));
})(vnova || (vnova = {}));
var vnova;
(function (vnova) {
    var video;
    (function (video) {
        var Texture = (function (_super) {
            __extends(Texture, _super);
            function Texture(aConfig) {
                var tGL = video.Context.gl;
                _super.call(this, aConfig);
                this.mTextureObject = tGL.createTexture();
                this.bind(0);
                tGL.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_T, WebGLRenderingContext.CLAMP_TO_EDGE);
                tGL.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_S, WebGLRenderingContext.CLAMP_TO_EDGE);
                tGL.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, WebGLRenderingContext.LINEAR);
                tGL.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.LINEAR);
            }
            Texture.prototype.bind = function (aTexUnit) {
                var tGL = video.Context.gl;
                tGL.activeTexture(WebGLRenderingContext.TEXTURE0 + aTexUnit);
                tGL.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.mTextureObject);
            };
            return Texture;
        }(video.Resource));
        video.Texture = Texture;
        var DataTexture = (function (_super) {
            __extends(DataTexture, _super);
            function DataTexture(aConfig) {
                var tGL = video.Context.gl;
                _super.call(this, aConfig);
                tGL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, aConfig.format, aConfig.width, aConfig.height, 0, aConfig.format, WebGLRenderingContext.UNSIGNED_BYTE, aConfig.data);
            }
            return DataTexture;
        }(Texture));
        video.DataTexture = DataTexture;
    })(video = vnova.video || (vnova.video = {}));
})(vnova || (vnova = {}));
var vnova;
(function (vnova) {
    var video;
    (function (video) {
        var Video = (function (_super) {
            __extends(Video, _super);
            function Video(aConfig) {
                _super.call(this, aConfig);
                this.mFormat = aConfig.format;
            }
            Video.prototype.onUpdate = function (aVideoElement) {
                var tGL = video.Context.gl;
                if (this.mLoaded && !aVideoElement.paused) {
                    this.bind(0);
                    tGL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, this.mFormat, this.mFormat, WebGLRenderingContext.UNSIGNED_BYTE, aVideoElement);
                }
            };
            Video.prototype.onReady = function (aVideoElement) {
                var tGL = video.Context.gl;
                this.mLoaded = true;
                this.bind(0);
                tGL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, this.mFormat, this.mFormat, WebGLRenderingContext.UNSIGNED_BYTE, aVideoElement);
            };
            return Video;
        }(video.Texture));
        video.Video = Video;
    })(video = vnova.video || (vnova.video = {}));
})(vnova || (vnova = {}));
var vnova;
(function (vnova) {
    var video;
    (function (video) {
        var Primitive = (function (_super) {
            __extends(Primitive, _super);
            function Primitive(aConfig) {
                var tGL = video.Context.gl;
                _super.call(this, aConfig);
                this.mVertexBuffer = tGL.createBuffer();
                this.mIndexBuffer = tGL.createBuffer();
                this.bind();
                tGL.bufferData(WebGLRenderingContext.ARRAY_BUFFER, new Float32Array(aConfig.vertices), WebGLRenderingContext.STATIC_DRAW);
                tGL.bufferData(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(aConfig.indices), WebGLRenderingContext.STATIC_DRAW);
                this.mDrawSize = aConfig.indices.length;
            }
            Primitive.prototype.bind = function () {
                var tGL = video.Context.gl;
                tGL.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, this.mVertexBuffer);
                tGL.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer);
            };
            Primitive.prototype.draw = function () {
                var tGL = video.Context.gl;
                tGL.drawElements(WebGLRenderingContext.TRIANGLES, this.mDrawSize, WebGLRenderingContext.UNSIGNED_SHORT, 0);
            };
            return Primitive;
        }(video.Resource));
        video.Primitive = Primitive;
    })(video = vnova.video || (vnova.video = {}));
})(vnova || (vnova = {}));
var vnova;
(function (vnova) {
    var video;
    (function (video) {
        var Material = (function () {
            function Material(aConfig) {
                var _this = this;
                this.mTextures = [];
                this.mAttribLocations = [];
                var tStride = 0, tOffset = 0;
                this.mShader = video.ResourceManager.getResource(aConfig.shader, video.Shader);
                this.mUniforms = aConfig.uniforms;
                aConfig.videoTextures && aConfig.videoTextures.forEach(function (aName) {
                    _this.mTextures.push(video.ResourceManager.getResource(aName, video.Video));
                });
                aConfig.dataTextures && aConfig.dataTextures.forEach(function (aName) {
                    _this.mTextures.push(video.ResourceManager.getResource(aName, video.DataTexture));
                });
                this.mTextures.forEach(function (aTexture, aIndex) {
                    _this.mShader.bindTextureUniform(aTexture.id, aIndex);
                });
                aConfig.vertexStructure.forEach(function (aAttribute) {
                    tStride += aAttribute.size;
                });
                tStride *= 4;
                aConfig.vertexStructure.forEach(function (aAttribute) {
                    _this.mAttribLocations.push(_this.mShader.bindAttribute(aAttribute, tStride, tOffset));
                    tOffset += aAttribute.size * 4;
                });
            }
            Material.prototype.use = function () {
                var _this = this;
                this.mShader.bind();
                this.mUniforms.forEach(function (aUniform) {
                    if (aUniform.updated) {
                        _this.mShader.updateUniform(aUniform);
                    }
                });
                this.mTextures.forEach(function (aTexture, aIndex) {
                    aTexture.bind(aIndex);
                });
            };
            return Material;
        }());
        video.Material = Material;
    })(video = vnova.video || (vnova.video = {}));
})(vnova || (vnova = {}));
var vnova;
(function (vnova) {
    var video;
    (function (video) {
        var RenderNode = (function () {
            function RenderNode(aPrimitive, aMaterial, aCamera) {
                this.mPrimitive = aPrimitive;
                this.mMaterial = aMaterial;
                this.mCamera = aCamera;
            }
            RenderNode.prototype.draw = function () {
                this.mPrimitive.bind();
                this.mMaterial.use();
                this.mPrimitive.draw();
            };
            return RenderNode;
        }());
        video.RenderNode = RenderNode;
        var VideoRenderer = (function () {
            function VideoRenderer(aResourceMap, aConfig, aCounterCallback, aRenderCallback) {
                var _this = this;
                this.mNodes = [];
                var tCamera = aConfig.camera && new video.Camera(aConfig.camera);
                video.ResourceManager.map = aResourceMap;
                aConfig.nodes.forEach(function (aNode) {
                    var tPrimitive = video.ResourceManager.getResource(aNode.primitive, video.Primitive), tMaterial = new video.Material(aNode.material);
                    _this.mNodes.push(new RenderNode(tPrimitive, tMaterial, tCamera));
                });
                this.mFPSCounter = new video.Performance(aCounterCallback);
                this.mRenderCallback = aRenderCallback;
            }
            VideoRenderer.prototype.run = function () {
                var tGL = video.Context.gl;
                tGL.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
                this.mRenderCallback && this.mRenderCallback();
                this.mNodes.forEach(function (aNode) {
                    aNode.draw();
                });
                this.mFPSCounter.registerTick();
                window.requestAnimationFrame(this.run.bind(this));
            };
            return VideoRenderer;
        }());
        video.VideoRenderer = VideoRenderer;
    })(video = vnova.video || (vnova.video = {}));
})(vnova || (vnova = {}));
var vnova;
(function (vnova) {
    var app;
    (function (app) {
        var VideoPlayer = (function () {
            function VideoPlayer(aVideoSource) {
                this.test = 0;
                var tTextureConfig = VideoPlayer.sResources.map["effectTexture"], tVideoElement;
                tTextureConfig.data = new Uint8Array(vnova.video.Utils.generateBinaryNoise(VideoPlayer.sEffectConfig.modifier, VideoPlayer.sEffectConfig.count, VideoPlayer.sEffectConfig.width * VideoPlayer.sEffectConfig.height));
                this.mEffectVideoRatio = new vnova.video.FloatUniform({
                    name: "effectScale",
                    initialValue: 0
                });
                this.mCanvas = document.getElementById("canvas");
                this.mVideoElement = document.createElement("video");
                this.mVideoElement.autoplay = true;
                this.mVideoElement.loop = true;
                this.mVideoElement.muted = true;
                this.mVideoElement.setAttribute("crossOrigin", "anonymous");
                this.mVideoElement.onloadedmetadata = this.onVideoSizeKnown.bind(this);
                VideoPlayer.sScene.nodes[0].material.uniforms = [this.mEffectVideoRatio];
                this.mFramework = new vnova.video.VideoRenderer(VideoPlayer.sResources, VideoPlayer.sScene, this.onFPSCounterUpdate.bind(this), this.onRenderFrame.bind(this));
                this.mPlayIcon = document.getElementById("playIcon");
                this.mVideo = vnova.video.ResourceManager.getResource("video", vnova.video.Video);
                this.mVideoElement.oncanplay = this.onVideoReady.bind(this);
                this.mPlayIcon.onclick = this.mCanvas.onclick = this.onCanvasClick.bind(this);
                window.onresize = this.onSizeChanged.bind(this);
                this.mVideoElement.src = aVideoSource;
                this.mFramework.run();
            }
            VideoPlayer.prototype.onCanvasClick = function () {
                var tVideoElement = this.mVideoElement;
                if (!tVideoElement.paused) {
                    tVideoElement.pause();
                    this.mPlayIcon.style.visibility = "visible";
                }
                else {
                    tVideoElement.play();
                    this.mPlayIcon.style.visibility = "hidden";
                }
            };
            VideoPlayer.prototype.onSizeChanged = function () {
                {
                    var tVideoElement = this.mVideoElement, tVideoAspect = tVideoElement.videoWidth / tVideoElement.videoHeight, tHeight = Math.min(tVideoElement.videoHeight, window.innerHeight) - 50, tWidth = tHeight * tVideoAspect;
                    this.mPlayIcon.style.left = [((tWidth - this.mPlayIcon.width) / 2).toString(), "px"].join("");
                    this.mPlayIcon.style.top = [((tHeight - this.mPlayIcon.height) / 2).toString(), "px"].join("");
                    this.mCanvas.width = tWidth;
                    this.mCanvas.height = tHeight;
                    vnova.video.Context.gl.viewport(0.0, 0.0, tWidth, tHeight);
                }
            };
            VideoPlayer.prototype.onVideoSizeKnown = function () {
                var tVideoElement = this.mVideoElement;
                this.mEffectVideoRatio.value = tVideoElement.videoWidth / VideoPlayer.sEffectConfig.width;
                this.onSizeChanged();
            };
            VideoPlayer.prototype.onRenderFrame = function () {
                this.mVideo.onUpdate(this.mVideoElement);
            };
            VideoPlayer.prototype.onVideoReady = function () {
                this.mVideo.onReady(this.mVideoElement);
            };
            VideoPlayer.prototype.onFPSCounterUpdate = function (aFPS) {
                document.getElementById("fps").innerHTML = [" FPS: ", aFPS.toString()].join(" ");
            };
            VideoPlayer.sEffectConfig = {
                width: 1920,
                height: 1080,
                modifier: 50,
                count: 1000
            };
            VideoPlayer.sResources = {
                map: {
                    videoPrimitive: {
                        id: "videoPrimitive",
                        vertices: [1.0, 1.0, 1.0, 0.0,
                            -1.0, 1.0, 0.0, 0.0,
                            -1.0, -1.0, 0.0, 1.0,
                            1.0, -1.0, 1.0, 1.0],
                        indices: [0, 1, 2, 0, 2, 3]
                    },
                    videoShader: {
                        id: "videoShader",
                        vertexShader: "\n                        precision mediump float;\n                        attribute vec2 pos;\n                        attribute vec2 texCoord;\n                        varying vec2 tex;\n                        \n                        void main()\n                        {\n                            gl_Position =  vec4(pos, 0.0, 1.0);\n                            tex = texCoord;\n                        }\n                    ",
                        fragmentShader: "\n                        precision mediump float;\n\n                        const vec2 effectStep = vec2(1.0/1920.0, 1.0/1080.0);\n                        uniform sampler2D video;\n                        uniform sampler2D effectTexture;\n                        uniform float effectScale;\n                        varying vec2 tex;\n\n                        //DESIGN-NOTE: applying a simple custom kernel for this example\n                        // when the size between video texture and effect texture is greater than 2.\n                        // A smarter convolution based image rescaling technique\n                        // could be used here. also the kernel could be provided as a uniform\n                        // from client-side for better configurability.\n\n                        const mat3 gauss = mat3(\n                            1.0/16.0, 1.0/8.0, 1.0/16.0,\n                            1.0/8.0,  1.0/4.0, 1.0/8.0,\n                            1.0/16.0, 1.0/8.0, 1.0/16.0\n                        );\n\n                        const mat3 edge = mat3(\n                            -1.0, -1.0, -1.0,\n                            -1.0,  8.0, -1.0,\n                            -1.0, -1.0, -1.0\n                        );\n\n                        const mat3 xSteps = mat3(\n                            -effectStep.x,  0.0, effectStep.x,\n                            -effectStep.x,  0.0, effectStep.x,\n                            -effectStep.x,  0.0, effectStep.x\n                        );\n                        const mat3 ySteps = mat3(\n                            -effectStep.y, -effectStep.y, -effectStep.y,\n                             0.0,           0.0,           0.0,\n                             effectStep.y,  effectStep.y,  effectStep.y\n                        );\n\n                        vec4 convolve(sampler2D sampler, mat3 kernel, vec2 uv)\n                        {\n                            vec4 texel = vec4(0.0, 0.0, 0.0, 0.0);\n\n                            //DESIGN-NOTE: this bit could perform a bit better with loop unwinding\n                            for (int i = 0; i < 3; i++)\n                            {\n                                for (int j = 0; j < 3; j++)\n                                {\n                                    texel += texture2D( sampler, uv + vec2( xSteps[i][j], ySteps[i][j] ) ) * vec4( kernel[i][j] );\n                                }\n                            }\n                            return texel;\n                        }\n\n                        void main()\n                        {\n                            //DESIGN-NOTE: It is not ideal to have this branching in this shader.\n                            // I am keeping it this way for the sake of this demo. also, the edge detector\n                            // is not part of the spec, was in place for a test, but I decided to keep it.\n    \n                            vec4 texel;\n                            texel = (tex.x <= 0.5) ? texture2D(video, tex) : convolve(video, edge, tex);\n                            texel += (effectScale <= 0.5) ? vec4(convolve(effectTexture, gauss, tex).rgb, 0.0) : vec4(texture2D(effectTexture, tex).rgb, 0.0);\n                            gl_FragColor = texel;\n                        }\n                    "
                    },
                    video: {
                        id: "video",
                        format: WebGLRenderingContext.RGB
                    },
                    effectTexture: {
                        id: "effectTexture",
                        format: WebGLRenderingContext.LUMINANCE,
                        width: VideoPlayer.sEffectConfig.width,
                        height: VideoPlayer.sEffectConfig.height
                    }
                }
            };
            VideoPlayer.sScene = {
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
            return VideoPlayer;
        }());
        app.VideoPlayer = VideoPlayer;
    })(app = vnova.app || (vnova.app = {}));
})(vnova || (vnova = {}));
//# sourceMappingURL=player.js.map