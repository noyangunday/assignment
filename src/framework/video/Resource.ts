/*

    2019, V-Nova

    author: Noyan Gunday
    date: 03 feb 2019

*/

module vnova.video {

    //DESIGN-NOTE: The resource manager could also implement a bookkeeping logic
    // to keep track of currently bound GPU resources and avoid blind binding of
    // resources as a performance optimisation.
    // Further optimisation could be achieved by checking the source(i.e. the video URL)
    // or some hash value for the shader scripts to avoid loading of the same resources.
    // multiple times. None of these were implemented for this example.

    /* GPU Resource Types */
    export interface IResourceConfig {
        id: string;
    }

    export interface IResourceMap {
        map: {[name: string]: IResourceConfig};
    }

    export interface IGPUResource {
        items: {[name: string]: Resource};
    }

    export class Resource {
        private mId: string;

        constructor(aConfig: IResourceConfig) {
            this.mId = aConfig.id
        }

        public get id(): string {
            return this.mId;
        }

    }

    export class ResourceManager {
        private static sResourceMap: IResourceMap;
        private static sResources: IGPUResource = {items:{}};

        public static set map(aResourceMap: IResourceMap) {
            this.sResourceMap = aResourceMap;
        }

        public static getResource(aName: string, aResConst: {new (aConfig: any): Resource}): Resource {
            var tResource: Resource = ResourceManager.sResources.items[aName];
            if (tResource) {
                return tResource;
            }
            tResource = new aResConst(ResourceManager.sResourceMap.map[aName]);
            ResourceManager.sResources.items[aName] = tResource;
            return tResource;
        }
    }
}
