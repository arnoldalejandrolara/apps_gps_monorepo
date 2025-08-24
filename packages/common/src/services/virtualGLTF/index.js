import { postProcessGLTF } from '@loaders.gl/gltf';

export async function createVirtualGLTF(color) {
  const processGLTF = (gltf) => {
    const modifiedGLTF = { ...gltf };

    if (modifiedGLTF.json && modifiedGLTF.json.materials) {
      modifiedGLTF.json.materials = modifiedGLTF.json.materials.map(material => {
        if (material.name === 'Chassis') {
          return {
            ...material,
            pbrMetallicRoughness: {
              ...material.pbrMetallicRoughness,
              baseColorFactor: [...color, 1.0]
            }
          };
        }
        return material;
      });
    }

    return modifiedGLTF;
  };

  return processGLTF;
}