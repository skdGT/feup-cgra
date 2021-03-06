/**
* MyScene
* @constructor
*/
class MyScene extends CGFscene {
    constructor() {
        super();
        this.texture = null;
        this.appearance = null;

        // initial configuration of interface
        this.selectedTexture = 0;
        this.wireframe = false;
        this.displayVehicle = true;
        this.displayFlag = true;
    }

    init(application) {
        super.init(application);
        this.initCameras();
        this.initLights();

        //Background color
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.enableTextures(true);

        //Initialize scene objects
        this.axis = new CGFaxis(this);
        this.cubeMap = new MyCubeMap(this);
        this.vehicle = new MyVehicle(this, 4);
        this.terrain = new MyTerrain(this);
        this.supplies = [
            new MySupply(this),
            new MySupply(this),
            new MySupply(this),
            new MySupply(this),
            new MySupply(this),
        ];
        this.billboard = new MyBillboard(this);
        //------

        //------ Applied Material
        this.Material = new CGFappearance(this);
        this.Material.setAmbient(0.1, 0.1, 0.1, 1);
        this.Material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.Material.setSpecular(0.1, 0.1, 0.1, 1);
        this.Material.setShininess(10.0);
        this.Material.loadTexture('images/earth.jpg');  //TODO mudar para earth no fim de testar
        this.Material.setTextureWrap('REPEAT', 'REPEAT');
        //------

        //------ Textures
        this.textures = [
            new CGFtexture(this, 'images/mountain.png'),
            new CGFtexture(this, 'images/cubemap.png'),
            new CGFtexture(this, 'images/test.png'),
            new CGFtexture(this, 'images/testMap_cube.jpg')
        ];
        this.textureList = {
            'Mountain' : 0,
            'CloudySkies' : 1,
            'TestFaces' : 2,
            'TestTexture' : 3,
        };
        //-------

        this.setUpdatePeriod(1000/60);  // 60Hz

        //Objects connected to MyInterface
        this.displayAxis = false;
        this.scaleFactor = 1;
        this.speedFactor = 1;
        //-------

        this.lastUpdate = 0;
        this.nSuppliesDelivered = 0;
        this.timeAfterLastSupply = Number.MAX_VALUE;

        this.pressedP = 0;
    }

    checkKeys() {
        // keycodes => https://keycode.info/
        if (this.gui.isKeyPressed("KeyW") && !this.vehicle.autopilot)
            this.vehicle.accelerate(0.005 * this.speedFactor);

        if (this.gui.isKeyPressed("KeyS") && !this.vehicle.autopilot)
            this.vehicle.accelerate(-0.005 * this.speedFactor);

        if (this.gui.isKeyPressed("KeyA") && !this.vehicle.autopilot)
            this.vehicle.turn(5);

        if (this.gui.isKeyPressed("KeyD") && !this.vehicle.autopilot)
            this.vehicle.turn(-5);

        if (this.gui.isKeyPressed("PageUp") && !this.vehicle.autopilot)
            this.vehicle.rise(0.1);

        if (this.gui.isKeyPressed("PageDown") && !this.vehicle.autopilot)
            this.vehicle.rise(-0.1);

        if (this.gui.isKeyPressed("ArrowDown") && !this.vehicle.autopilot)
            this.vehicle.pitch(3);

        if (this.gui.isKeyPressed("ArrowUp") && !this.vehicle.autopilot)
            this.vehicle.pitch(-3);


        if (this.gui.isKeyPressed("KeyR")){
            this.vehicle.reset();
            this.nSuppliesDelivered = 0;
            for (var i=0 ; i<5; i++){
                this.supplies[i].state = SupplyStates.INACTIVE;
                this.supplies[i].passedtime = 0;
                this.supplies[i].y = 9;
            }
        }

        if (this.gui.isKeyPressed("KeyP")) {
            const time = this.lastUpdate - this.pressedP;
            if (time > 100) {
                this.pressedP = this.lastUpdate;
                if (!this.vehicle.autopilot)
                    this.vehicle.activateAutopilot();
                else
                    this.vehicle.deactivateAutopilot();
            }
        }

        if (this.gui.isKeyPressed("KeyL")) {
            if (this.nSuppliesDelivered !== 5 && this.timeAfterLastSupply > 500) {
                this.supplies[this.nSuppliesDelivered].drop(this.vehicle.x, this.vehicle.z);
                this.nSuppliesDelivered++;
                this.timeAfterLastSupply = 0;
            }
        }
    }

    initLights() {
        this.lights[0].setPosition(15, 2, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }

    initCameras() {
        this.camera = new CGFcamera(1.0, 0.1, 500, vec3.fromValues(21, 10, 21), vec3.fromValues(0, 6, 0));
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    onSelectedTextureChanged(v) {
        // update wireframe mode when the object changes
        this.Material.setTexture(this.textures[this.selectedTexture]);
    }

    onWireframeChanged(v) {
        if (v) {
            this.terrain.setLineMode();
            this.cubeMap.setLineMode();
            this.vehicle.setLineMode();
            this.billboard.setLineMode();
            for (var i=0 ; i<5; i++)
                this.supplies[i].setLineMode();
        }
        else {
            this.terrain.setFillMode();
            this.vehicle.setFillMode();
            this.cubeMap.setFillMode();
            this.billboard.setFillMode();
            for (var i=0 ; i<5; i++)
                this.supplies[i].setFillMode();
        }

    }

    //Function that resets selected texture in quadMaterial
    updateAppliedTexture() {
        this.Material.setTexture(this.textures[this.selectedTexture]);
    }

    // called periodically (as per setUpdatePeriod() in init())
    update(t) {
        if (this.lastUpdate === 0)
            this.lastUpdate = t;
        let elapsedTime = t - this.lastUpdate;
        this.lastUpdate = t;

        this.checkKeys();

        this.vehicle.update(elapsedTime);
        for (var i=0 ; i<5; i++){
            this.supplies[i].update(elapsedTime);
        }
        this.timeAfterLastSupply += elapsedTime;
    }

    display() {
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();
        this.setDefaultAppearance();

        // ---- BEGIN Primitive drawing section
        this.pushMatrix();
        // Draw axis
        if (this.displayAxis)
            this.axis.display();

        if (this.displayVehicle) {
            this.translate(this.vehicle.x, this.vehicle.y, this.vehicle.z);
            this.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);
            this.translate(-this.vehicle.x, -this.vehicle.y, -this.vehicle.z);
            this.vehicle.display();
        }
        this.popMatrix();
        this.Material.apply();
        this.terrain.display();

        for (var i=0 ; i<5; i++)
            this.supplies[i].display();

        this.billboard.display();

        this.Material.apply();
        this.updateAppliedTexture();
        this.pushMatrix();
        this.translate(0, 10, 0);
        this.cubeMap.display();

        this.popMatrix();
        // ---- END Primitive drawing section
    }
}