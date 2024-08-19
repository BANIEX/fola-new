const {
  ConvertGLBtoGltf,
  ConvertGltfToGLB,
  ConvertToGLB,
} = require("gltf-import-export");
const fs = require("fs");
const path = require("path");

const paths = fs.readdirSync(path.join(__dirname, "../public/models"));
fs.mkdirSync(path.join(__dirname, "../public/models/gltf"));
for (const p of paths) {
  ConvertGLBtoGltf(
    path.join(__dirname, "../public/models/" + p),
    path.join(__dirname, "../public/models/gltf/" + p + ".gltf")
  );
}

// let gltfContent = fs.readFileSync(extractedGltfFilename, 'utf8');
// let gltf = JSON.parse(gltfContent);

// const outputGlb = 'newfile.glb';

// // Perform the conversion; output path is overwritten
// ConvertToGLB(gltf, extractedGltfFilename, outputGlb);

// const gltfFilename = 'pathtoyour.gltf';

// // optionally if you haven't already parsed the gltf JSON
// ConvertGltfToGLB(gltfFilename, outputGlb);
