/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initMaterials(this.scene);

        this.greenSquare = new MyDiamond(this.scene);
        this.yellowParallelogram = new MyParallelogram(this.scene);
        this.orangeTriangle = new MyTriangleBig(this.scene);
        this.blueTriangle = new MyTriangleBig(this.scene);
        this.pinkTriangle = new MyTriangle(this.scene);
        this.purpleTriangle = new MyTriangleSmall(this.scene);
        this.redTriangle = new MyTriangleSmall(this.scene);

    }

    initMaterials(scene){
        // Green color
        this.green = new CGFappearance(scene);
        this.green.setAmbient(0.1,0.1,0.1,1.0);
        this.green.setDiffuse(0,1,0,1.0);
        this.green.setSpecular(1,1,1,1.0);
        this.green.setShininess(10.0);

        // Blue color
        this.blue = new CGFappearance(scene);
        this.blue.setAmbient(0.1,0.1,0.1,1.0);
        this.blue.setDiffuse(0,0.749*0.7,1*0.7,1.0);
        this.blue.setSpecular(1,1,1,1.0);
        this.blue.setShininess(10.0);

        // Pink color
        this.pink = new CGFappearance(scene);
        this.pink.setAmbient(0.1,0.1,0.1,1.0);
        this.pink.setDiffuse(1*0.7,0.714*0.7,0.757*0.7,1.0);
        this.pink.setSpecular(1,1,1,0);
        this.pink.setShininess(10.0);

        // orange color
        this.orange = new CGFappearance(scene);
        this.orange.setAmbient(0.1,0.1,0.1,1.0);
        this.orange.setDiffuse(1*0.7,0.647*0.7,0,1.0);
        this.orange.setSpecular(1,1,1,0);
        this.orange.setShininess(10.0);

        // yellow color
        this.yellow = new CGFappearance(scene);
        this.yellow.setAmbient(0.1,0.1,0.1,1.0);
        this.yellow.setDiffuse(1*0.7,1*0.7,0,1.0);
        this.yellow.setSpecular(1,1,1,0);
        this.yellow.setShininess(10.0);

        // red color
        this.red = new CGFappearance(scene);
        this.red.setAmbient(0.1,0.1,0.1,1.0);
        this.red.setDiffuse(1*0.7,0,0,1.0);
        this.red.setSpecular(1,1,1,0);
        this.red.setShininess(10.0);

        // purple color
        this.purple = new CGFappearance(scene);
        this.purple.setAmbient(0.1,0.1,0.1,1.0);
        this.purple.setDiffuse(0.58*0.7,0,0.827*0.7,1.0);
        this.purple.setSpecular(1,1,1,1.0);
        this.purple.setShininess(10.0);
    }

    display() {
        this.scene.pushMatrix();

        var tra =  [1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            3.3, 2.3, 0.0, 1.0];

        this.scene.pushMatrix();
        this.scene.multMatrix(tra);
        //this.scene.setDiffuse(0,1,0,0);
        //this.green.apply();
        this.greenSquare.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.4,1.4,0);
        this.scene.rotate(45.0*Math.PI/180.0, 0,0,1);
        //this.scene.setDiffuse(0,0,1,0);
        this.blue.apply();
        this.blueTriangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.4,0,0);
        this.scene.rotate(-135.0*Math.PI/180.0, 0, 0, 1);
        //this.scene.setDiffuse(1, 102/255, 204/255, 0);
        this.pink.apply();
        this.pinkTriangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(90.0*Math.PI/180.0,0,0,1);
        //this.scene.setDiffuse(1, 128/255, 0, 0);
        this.orange.apply();
        this.orangeTriangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-3, -1, 0);
        this.scene.scale(1, -1, 1);
        //this.scene.setDif,fuse(1, 1, 0, 0);
        this.yellow.apply();
        this.yellowParallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.1, -0.7, 0);
        this.scene.rotate(45.0*Math.PI/180.0, 0, 0, 1);
        //this.scene.setDiffuse(1, 0, 0, 0);
        this.red.apply();
        this.redTriangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.4, -1.6, 0);
        this.scene.rotate(90.0*Math.PI/180.0, 0, 0, 1);
        //this.scene.setDiffuse(204/255, 0, 204/255, 0);
        this.purple.apply();
        this.purpleTriangle.display();
        this.scene.popMatrix();
    }

    enableNormalViz() {
        this.greenSquare.enableNormalViz();
        this.orangeTriangle.enableNormalViz();
        this.purpleTriangle.enableNormalViz();
        this.redTriangle.enableNormalViz();
        this.yellowParallelogram.enableNormalViz();
        this.blueTriangle.enableNormalViz();
        this.pinkTriangle.enableNormalViz();
    }

    disableNormalViz() {
        this.greenSquare.disableNormalViz();
        this.orangeTriangle.disableNormalViz();
        this.purpleTriangle.disableNormalViz();
        this.redTriangle.disableNormalViz();
        this.yellowParallelogram.disableNormalViz();
        this.blueTriangle.disableNormalViz();
        this.pinkTriangle.disableNormalViz();
    }

    updateBuffers(complexity){
        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}

