import Map from './map.js';
import Camera from './camera.js';
import Input from './input.js';

export default class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a3a52);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        this.map = new Map(this.scene);
        this.camera = new Camera(this.renderer);
        this.input = new Input(this);

        this.turn = 1;
        this.selectedUnit = null;
        this.gameRunning = false;

        this.setupLighting();
        this.setupUnits();
        this.bindEvents();
        window.addEventListener('resize', () => this.onWindowResize());
    }

    init() {
        this.map.generate(50, 50);
        this.gameRunning = true;
    }

    start() {
        this.animate();
    }

    setupLighting() {
        const light = new THREE.DirectionalLight(0xffffff, 0.8);
        light.position.set(100, 150, 100);
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        this.scene.add(light);

        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambient);
    }

    setupUnits() {
        this.units = [];

        const unit = this.createUnit(10, 10, 'soldier');
        this.units.push(unit);
        this.selectedUnit = unit;
        this.updateUI();
    }

    createUnit(x, z, type = 'soldier') {
        const geometry = new THREE.ConeGeometry(0.3, 1, 8);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff6b6b,
            roughness: 0.7
        });
        const unit = new THREE.Mesh(geometry, material);

        const tile = this.map.getTile(x, z);
        if (tile) {
            unit.position.copy(tile.position);
            unit.position.y += 0.6;
        }

        unit.castShadow = true;
        unit.receiveShadow = true;
        this.scene.add(unit);

        return {
            mesh: unit,
            x: x,
            z: z,
            type: type,
            moved: false
        };
    }

    bindEvents() {
        document.getElementById('nextTurnBtn').addEventListener('click', () => {
            this.nextTurn();
        });
    }

    nextTurn() {
        this.turn++;
        this.units.forEach(u => u.moved = false);
        this.updateUI();
    }

    selectUnit(unit) {
        this.selectedUnit = unit;
        this.updateUI();
    }

    moveSelectedUnit(dx, dz) {
        if (!this.selectedUnit || this.selectedUnit.moved) return;

        const newX = this.selectedUnit.x + dx;
        const newZ = this.selectedUnit.z + dz;

        if (this.map.isValidTile(newX, newZ)) {
            this.selectedUnit.x = newX;
            this.selectedUnit.z = newZ;
            this.selectedUnit.moved = true;

            const tile = this.map.getTile(newX, newZ);
            if (tile) {
                this.selectedUnit.mesh.position.copy(tile.position);
                this.selectedUnit.mesh.position.y += 0.6;
            }
        }
    }

    updateUI() {
        document.getElementById('turnNumber').textContent = this.turn;

        if (this.selectedUnit) {
            document.getElementById('selectedUnit').style.display = 'block';
            document.getElementById('unitType').textContent = this.selectedUnit.type;
            document.getElementById('unitPos').textContent =
                `(${this.selectedUnit.x}, ${this.selectedUnit.z})`;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera.camera);
    }

    onWindowResize() {
        this.camera.onWindowResize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
