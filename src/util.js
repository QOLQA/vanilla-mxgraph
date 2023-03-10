// solo es mxgraph
import mxgraph from "@aire-ux/mxgraph";


function factory(mxBasePath) {
  return mxgraph({
    mxLoadResources: false,
    mxForceIncludes: false,
    mxLoadStylesheets: true,
    mxResourceExtension: '.txt',
    mxProductionMode: true,
    mxBasePath: mxBasePath,
  });
}

export default factory;