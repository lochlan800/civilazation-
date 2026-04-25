export default class Camera {
    constructor(renderer) {
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );

        this.camera.position.set(0, 40, 35);
        this.camera.lookAt(0, 0, 0);

        this.distance = 50;
        this.height = 40;
        this.angle = 0;
        this.targetX = 0;
        this.targetZ = 0;

        this.setupControls();
    }

    setupControls() {
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.distance += e.deltaY * 0.05;
            this.distance = Math.max(20, Math.min(150, this.distance));
            this.updatePosition();
        }, { passive: false });

        document.addEventListener('mousemove', (e) => {
            if (e.buttons === 2) {
                this.angle += e.movementX * 0.005;
                this.height += e.movementY * 0.1;
                this.height = Math.max(10, Math.min(100, this.height));
                this.updatePosition();
            }
        });

        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    updatePosition() {
        this.camera.position.x = this.targetX + Math.sin(this.angle) * this.distance;
        this.camera.position.y = this.height;
        this.camera.position.z = this.targetZ + Math.cos(this.angle) * this.distance;
        this.camera.lookAt(this.targetX, 0, this.targetZ);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}
