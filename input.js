export default class Input {
    constructor(game) {
        this.game = game;
        this.keys = {};

        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.handleKeyPress(e.key.toLowerCase());
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        document.addEventListener('click', (e) => this.handleClick(e));
    }

    handleKeyPress(key) {
        if (!this.game.selectedUnit) return;

        switch (key) {
            case 'w':
            case 'arrowup':
                this.game.moveSelectedUnit(0, -1);
                break;
            case 's':
            case 'arrowdown':
                this.game.moveSelectedUnit(0, 1);
                break;
            case 'a':
            case 'arrowleft':
                this.game.moveSelectedUnit(-1, 0);
                break;
            case 'd':
            case 'arrowright':
                this.game.moveSelectedUnit(1, 0);
                break;
        }
    }

    handleClick(event) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this.game.camera.camera);

        const unitMeshes = this.game.units.map(u => u.mesh);
        const intersects = raycaster.intersectObjects(unitMeshes);

        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            const unit = this.game.units.find(u => u.mesh === clickedMesh);
            if (unit) {
                this.game.selectUnit(unit);
            }
        }
    }
}
