/*

    author: Noyan Gunday
    date: 03 feb 2019

*/

module challenge.video {

    export class Context {
        private static sGLContext: WebGLRenderingContext;
        public static get gl(): WebGLRenderingContext {
            var tCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas"),
                tContext: WebGLRenderingContext;
            if (!Context.sGLContext) {
                try {
                    for (var i = 0; i < 4; i++) {
                        tContext = <WebGLRenderingContext> tCanvas.getContext(["webgl","experimental-webgl","moz-webgl","webkit-3d"][i], {alpha:false});
                        if (tContext)
                            break;
                    }
                    if (tContext) {
                        tContext.clearColor(0.0, 0.0, 0.0, 1.0);
                        tContext.enable(WebGLRenderingContext.DEPTH_TEST);
                        tContext.depthFunc(WebGLRenderingContext.LEQUAL);
                    }
                    Context.sGLContext = tContext;
                } catch (e) {
                    Context.sGLContext = null;
                    //DESIGN-NOTE: in case the webgl context is not supported by the browser, there has to be a
                    //fallback (to canvas 2d or similar). Not implemented for this example.
                }
            }
            return Context.sGLContext;
        }
    }
}
