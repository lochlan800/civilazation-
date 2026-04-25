export default class Map {
    constructor(scene) {
        this.scene = scene;
        this.tiles = {};
        this.width = 0;
        this.height = 0;
    }

    generate(width, height) {
        this.width = width;
        this.height = height;

        for (let x = 0; x < width; x++) {
            for (let z = 0; z < height; z++) {
                this.createTile(x, z);
            }
        }
    }

    createTile(x, z) {
        const key = `${x},${z}`;

        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 6);
        const height = Math.sin(x * 0.1) * 0.5 + Math.cos(z * 0.1) * 0.5;

        let color = 0x2d5016;
        if (height > 0.3) color = 0x8b7355;
        else if (height > 0) color = 0x4a7c4e;

        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            metalness: 0.1
        });

        const tile = new THREE.Mesh(geometry, material);
        tile.castShadow = true;
        tile.receiveShadow = true;

        const posX = x * 1.0 - this.width / 2;
        const posZ = z * 1.0 - this.height / 2;
        tile.position.set(posX, height * 0.5, posZ);

        this.scene.add(tile);

        this.tiles[key] = {
            mesh: tile,
            position: tile.position.clone(),
            height: height,
            x: x,
            z: z,
            type: 'grass'
        };
    }

    getTile(x, z) {
        const key = `${x},${z}`;
        return this.tiles[key] || null;
    }

    isValidTile(x, z) {
        return x >= 0 && x < this.width && z >= 0 && z < this.height;
    }
}
