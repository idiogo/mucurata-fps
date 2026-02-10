/**
 * Roça Map Generator - Based on Fazenda Loureiro satellite image
 * Features: L-shaped main house with pool, smaller houses, trees, dirt roads
 */

class RocaMap {
    constructor(scene) {
        this.scene = scene;
        this.meshes = [];
        this.spawnPoints = {
            police: [],
            criminal: []
        };
        
        // Map dimensions
        this.width = 120;
        this.depth = 120;
        
        // Materials
        this.materials = {};
        
        this.createMaterials();
    }
    
    createMaterials() {
        // Grass ground
        const grassMat = new BABYLON.PBRMaterial("grassMat", this.scene);
        grassMat.albedoColor = new BABYLON.Color3(0.35, 0.45, 0.25);
        grassMat.roughness = 0.95;
        grassMat.metallic = 0;
        this.materials.grass = grassMat;
        
        // Dirt road
        const dirtMat = new BABYLON.PBRMaterial("dirtMat", this.scene);
        dirtMat.albedoColor = new BABYLON.Color3(0.55, 0.42, 0.3);
        dirtMat.roughness = 0.98;
        dirtMat.metallic = 0;
        this.materials.dirt = dirtMat;
        
        // Dry grass areas
        const dryGrassMat = new BABYLON.PBRMaterial("dryGrassMat", this.scene);
        dryGrassMat.albedoColor = new BABYLON.Color3(0.55, 0.5, 0.35);
        dryGrassMat.roughness = 0.95;
        dryGrassMat.metallic = 0;
        this.materials.dryGrass = dryGrassMat;
        
        // House walls - white/cream painted
        const wallMat = new BABYLON.PBRMaterial("wallMat", this.scene);
        wallMat.albedoColor = new BABYLON.Color3(0.92, 0.9, 0.85);
        wallMat.roughness = 0.8;
        wallMat.metallic = 0;
        this.materials.wall = wallMat;
        
        // Terracotta roof tiles
        const roofMat = new BABYLON.PBRMaterial("roofMat", this.scene);
        roofMat.albedoColor = new BABYLON.Color3(0.7, 0.35, 0.25);
        roofMat.roughness = 0.85;
        roofMat.metallic = 0;
        this.materials.roof = roofMat;
        
        // Dark roof (some houses)
        const darkRoofMat = new BABYLON.PBRMaterial("darkRoofMat", this.scene);
        darkRoofMat.albedoColor = new BABYLON.Color3(0.3, 0.25, 0.2);
        darkRoofMat.roughness = 0.7;
        darkRoofMat.metallic = 0.1;
        this.materials.darkRoof = darkRoofMat;
        
        // Pool water
        const waterMat = new BABYLON.PBRMaterial("waterMat", this.scene);
        waterMat.albedoColor = new BABYLON.Color3(0.4, 0.7, 0.8);
        waterMat.roughness = 0.1;
        waterMat.metallic = 0.2;
        waterMat.alpha = 0.85;
        this.materials.water = waterMat;
        
        // Pool edge/concrete
        const concreteMat = new BABYLON.PBRMaterial("concreteMat", this.scene);
        concreteMat.albedoColor = new BABYLON.Color3(0.75, 0.73, 0.7);
        concreteMat.roughness = 0.9;
        concreteMat.metallic = 0;
        this.materials.concrete = concreteMat;
        
        // Tree trunk
        const trunkMat = new BABYLON.PBRMaterial("trunkMat", this.scene);
        trunkMat.albedoColor = new BABYLON.Color3(0.35, 0.25, 0.18);
        trunkMat.roughness = 0.95;
        trunkMat.metallic = 0;
        this.materials.trunk = trunkMat;
        
        // Tree foliage (dark green)
        const foliageMat = new BABYLON.PBRMaterial("foliageMat", this.scene);
        foliageMat.albedoColor = new BABYLON.Color3(0.15, 0.35, 0.15);
        foliageMat.roughness = 0.9;
        foliageMat.metallic = 0;
        this.materials.foliage = foliageMat;
        
        // Wood material
        const woodMat = new BABYLON.PBRMaterial("woodMat", this.scene);
        woodMat.albedoColor = new BABYLON.Color3(0.4, 0.28, 0.18);
        woodMat.roughness = 0.8;
        woodMat.metallic = 0;
        this.materials.wood = woodMat;
    }
    
    generate() {
        this.createGround();
        this.createBarriers();
        this.createDirtRoads();
        this.createMainHouse();
        this.createPool();
        this.createSmallerHouses();
        this.createTrees();
        this.createProps();
        this.createSpawnPoints();
        this.createLighting();
        this.createSkybox();
    }
    
    createGround() {
        // Main grass ground
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {
            width: this.width * 2,
            height: this.depth * 2,
            subdivisions: 32
        }, this.scene);
        
        ground.material = this.materials.grass;
        ground.receiveShadows = true;
        ground.checkCollisions = true;
        ground.isPickable = true;
        
        this.meshes.push(ground);
        
        // Add some dry grass patches
        for (let i = 0; i < 8; i++) {
            const patch = BABYLON.MeshBuilder.CreateGround(`dryPatch_${i}`, {
                width: Utils.random(15, 30),
                height: Utils.random(15, 30)
            }, this.scene);
            patch.position = new BABYLON.Vector3(
                Utils.random(-80, 80),
                0.01,
                Utils.random(-80, 80)
            );
            patch.material = this.materials.dryGrass;
            patch.receiveShadows = true;
            this.meshes.push(patch);
        }
    }
    
    createBarriers() {
        const barrierHeight = 20;
        const mapHalfSize = this.width;
        
        const createBarrier = (name, width, height, depth, x, y, z) => {
            const barrier = BABYLON.MeshBuilder.CreateBox(name, {
                width, height, depth
            }, this.scene);
            barrier.position = new BABYLON.Vector3(x, y, z);
            barrier.visibility = 0;
            barrier.checkCollisions = true;
            barrier.isPickable = false;
            this.meshes.push(barrier);
        };
        
        createBarrier("barrierN", mapHalfSize * 2, barrierHeight, 2, 0, barrierHeight/2, mapHalfSize);
        createBarrier("barrierS", mapHalfSize * 2, barrierHeight, 2, 0, barrierHeight/2, -mapHalfSize);
        createBarrier("barrierE", 2, barrierHeight, mapHalfSize * 2, mapHalfSize, barrierHeight/2, 0);
        createBarrier("barrierW", 2, barrierHeight, mapHalfSize * 2, -mapHalfSize, barrierHeight/2, 0);
    }
    
    createDirtRoads() {
        // Main road going through the property
        const mainRoad = BABYLON.MeshBuilder.CreateGround("mainRoad", {
            width: 8,
            height: 200
        }, this.scene);
        mainRoad.position = new BABYLON.Vector3(-40, 0.02, 0);
        mainRoad.material = this.materials.dirt;
        mainRoad.receiveShadows = true;
        this.meshes.push(mainRoad);
        
        // Road to main house
        const houseRoad = BABYLON.MeshBuilder.CreateGround("houseRoad", {
            width: 60,
            height: 6
        }, this.scene);
        houseRoad.position = new BABYLON.Vector3(-10, 0.02, 0);
        houseRoad.material = this.materials.dirt;
        houseRoad.receiveShadows = true;
        this.meshes.push(houseRoad);
        
        // Circular area in front of main house
        const circularArea = BABYLON.MeshBuilder.CreateDisc("circularArea", {
            radius: 12
        }, this.scene);
        circularArea.rotation.x = Math.PI / 2;
        circularArea.position = new BABYLON.Vector3(15, 0.02, 0);
        circularArea.material = this.materials.dirt;
        circularArea.receiveShadows = true;
        this.meshes.push(circularArea);
    }
    
    createMainHouse() {
        // Main L-shaped house based on satellite image
        // Position centered around (0, 0)
        
        const wallHeight = 3.5;
        const wallThickness = 0.3;
        
        // Long wing of L (runs east-west)
        this.createHouseWing(0, 0, 25, 12, wallHeight, this.materials.wall, this.materials.roof);
        
        // Short wing of L (runs north-south, attached to east end)
        this.createHouseWing(18, -15, 12, 18, wallHeight, this.materials.wall, this.materials.roof);
        
        // Covered patio area connecting to pool
        const patioRoof = BABYLON.MeshBuilder.CreateBox("patioRoof", {
            width: 15,
            height: 0.15,
            depth: 10
        }, this.scene);
        patioRoof.position = new BABYLON.Vector3(5, 3, -10);
        patioRoof.material = this.materials.darkRoof;
        patioRoof.checkCollisions = true;
        this.meshes.push(patioRoof);
        
        // Patio pillars
        for (let i = 0; i < 4; i++) {
            const pillar = BABYLON.MeshBuilder.CreateCylinder(`patioPillar_${i}`, {
                diameter: 0.4,
                height: 3
            }, this.scene);
            const px = i % 2 === 0 ? -2 : 12;
            const pz = i < 2 ? -5 : -15;
            pillar.position = new BABYLON.Vector3(px, 1.5, pz);
            pillar.material = this.materials.wall;
            pillar.checkCollisions = true;
            this.meshes.push(pillar);
        }
    }
    
    createHouseWing(x, z, width, depth, height, wallMat, roofMat) {
        // Floor
        const floor = BABYLON.MeshBuilder.CreateBox(`floor_${x}_${z}`, {
            width: width,
            height: 0.2,
            depth: depth
        }, this.scene);
        floor.position = new BABYLON.Vector3(x, 0.1, z);
        floor.material = this.materials.concrete;
        floor.checkCollisions = true;
        this.meshes.push(floor);
        
        // Walls with openings
        const wallThickness = 0.3;
        const doorWidth = 4;
        const doorHeight = 3;
        
        // Front wall (south) with door
        this.createWallWithDoor(x, z - depth/2, width, height, wallThickness, doorWidth, doorHeight, wallMat, 0);
        
        // Back wall (north) with door
        this.createWallWithDoor(x, z + depth/2, width, height, wallThickness, doorWidth, doorHeight, wallMat, 0);
        
        // Left wall (west) with door
        this.createWallWithDoor(x - width/2, z, wallThickness, height, depth, doorWidth, doorHeight, wallMat, Math.PI/2);
        
        // Right wall (east) with door
        this.createWallWithDoor(x + width/2, z, wallThickness, height, depth, doorWidth, doorHeight, wallMat, Math.PI/2);
        
        // Roof (sloped terracotta)
        const roof = BABYLON.MeshBuilder.CreateBox(`roof_${x}_${z}`, {
            width: width + 2,
            height: 0.3,
            depth: depth + 2
        }, this.scene);
        roof.position = new BABYLON.Vector3(x, height + 0.15, z);
        roof.material = roofMat;
        roof.checkCollisions = true;
        this.meshes.push(roof);
        
        // Add roof ridge for sloped appearance
        const ridge = BABYLON.MeshBuilder.CreateBox(`ridge_${x}_${z}`, {
            width: width + 2,
            height: 1,
            depth: 1
        }, this.scene);
        ridge.position = new BABYLON.Vector3(x, height + 0.8, z);
        ridge.material = roofMat;
        this.meshes.push(ridge);
    }
    
    createWallWithDoor(x, z, width, height, depth, doorWidth, doorHeight, material, rotation) {
        // Create wall with door opening (2 pieces + top piece)
        const isHorizontal = rotation === 0;
        const wallWidth = isHorizontal ? width : depth;
        const wallDepth = isHorizontal ? depth : width;
        
        const sideWidth = (wallWidth - doorWidth) / 2;
        
        // Left piece
        const leftWall = BABYLON.MeshBuilder.CreateBox(`wall_left_${x}_${z}`, {
            width: sideWidth,
            height: height,
            depth: wallDepth
        }, this.scene);
        const leftOffset = isHorizontal ? -wallWidth/2 + sideWidth/2 : 0;
        const leftOffsetZ = isHorizontal ? 0 : -wallWidth/2 + sideWidth/2;
        leftWall.position = new BABYLON.Vector3(x + leftOffset, height/2, z + leftOffsetZ);
        leftWall.rotation.y = rotation;
        leftWall.material = material;
        leftWall.checkCollisions = true;
        this.meshes.push(leftWall);
        
        // Right piece
        const rightWall = BABYLON.MeshBuilder.CreateBox(`wall_right_${x}_${z}`, {
            width: sideWidth,
            height: height,
            depth: wallDepth
        }, this.scene);
        const rightOffset = isHorizontal ? wallWidth/2 - sideWidth/2 : 0;
        const rightOffsetZ = isHorizontal ? 0 : wallWidth/2 - sideWidth/2;
        rightWall.position = new BABYLON.Vector3(x + rightOffset, height/2, z + rightOffsetZ);
        rightWall.rotation.y = rotation;
        rightWall.material = material;
        rightWall.checkCollisions = true;
        this.meshes.push(rightWall);
        
        // Top piece above door
        const topWall = BABYLON.MeshBuilder.CreateBox(`wall_top_${x}_${z}`, {
            width: doorWidth,
            height: height - doorHeight,
            depth: wallDepth
        }, this.scene);
        topWall.position = new BABYLON.Vector3(x, doorHeight + (height - doorHeight)/2, z);
        topWall.rotation.y = rotation;
        topWall.material = material;
        topWall.checkCollisions = true;
        this.meshes.push(topWall);
    }
    
    createPool() {
        // Pool area to the south of main house
        const poolX = 5;
        const poolZ = -18;
        const poolWidth = 10;
        const poolDepth = 6;
        const poolDepthY = 1.5;
        
        // Pool edge/deck
        const poolDeck = BABYLON.MeshBuilder.CreateBox("poolDeck", {
            width: poolWidth + 4,
            height: 0.3,
            depth: poolDepth + 4
        }, this.scene);
        poolDeck.position = new BABYLON.Vector3(poolX, 0.15, poolZ);
        poolDeck.material = this.materials.concrete;
        poolDeck.checkCollisions = true;
        this.meshes.push(poolDeck);
        
        // Pool water surface
        const poolWater = BABYLON.MeshBuilder.CreateBox("poolWater", {
            width: poolWidth,
            height: 0.1,
            depth: poolDepth
        }, this.scene);
        poolWater.position = new BABYLON.Vector3(poolX, 0.2, poolZ);
        poolWater.material = this.materials.water;
        this.meshes.push(poolWater);
        
        // Pool walls (visual depth)
        const poolBottom = BABYLON.MeshBuilder.CreateBox("poolBottom", {
            width: poolWidth,
            height: 0.1,
            depth: poolDepth
        }, this.scene);
        poolBottom.position = new BABYLON.Vector3(poolX, -poolDepthY, poolZ);
        poolBottom.material = this.materials.water;
        this.meshes.push(poolBottom);
    }
    
    createSmallerHouses() {
        // Based on satellite image - several smaller houses around the property
        
        // House to the north (top of image)
        this.createSmallHouse(0, 45, 10, 8);
        
        // House to the northeast
        this.createSmallHouse(35, 35, 8, 7);
        
        // House to the northwest (across the road)
        this.createSmallHouse(-55, 25, 9, 8);
        
        // House to the south
        this.createSmallHouse(-15, -45, 8, 7);
        
        // Small structure to the east
        this.createSmallHouse(45, 0, 6, 5);
        
        // Barn/storage building
        this.createBarn(-60, -30, 15, 10);
    }
    
    createSmallHouse(x, z, width, depth) {
        const height = 3;
        
        // Floor
        const floor = BABYLON.MeshBuilder.CreateBox(`smallFloor_${x}_${z}`, {
            width: width,
            height: 0.15,
            depth: depth
        }, this.scene);
        floor.position = new BABYLON.Vector3(x, 0.075, z);
        floor.material = this.materials.concrete;
        floor.checkCollisions = true;
        this.meshes.push(floor);
        
        // Walls with big openings
        const wallThickness = 0.25;
        const doorWidth = 3.5;
        
        // Front and back walls
        this.createSimpleWallWithDoor(x, z - depth/2, width, height, wallThickness, doorWidth);
        this.createSimpleWallWithDoor(x, z + depth/2, width, height, wallThickness, doorWidth);
        
        // Side walls (solid)
        const leftWall = BABYLON.MeshBuilder.CreateBox(`leftWall_${x}_${z}`, {
            width: wallThickness,
            height: height,
            depth: depth
        }, this.scene);
        leftWall.position = new BABYLON.Vector3(x - width/2, height/2, z);
        leftWall.material = this.materials.wall;
        leftWall.checkCollisions = true;
        this.meshes.push(leftWall);
        
        const rightWall = BABYLON.MeshBuilder.CreateBox(`rightWall_${x}_${z}`, {
            width: wallThickness,
            height: height,
            depth: depth
        }, this.scene);
        rightWall.position = new BABYLON.Vector3(x + width/2, height/2, z);
        rightWall.material = this.materials.wall;
        rightWall.checkCollisions = true;
        this.meshes.push(rightWall);
        
        // Terracotta roof
        const roof = BABYLON.MeshBuilder.CreateBox(`smallRoof_${x}_${z}`, {
            width: width + 1.5,
            height: 0.2,
            depth: depth + 1.5
        }, this.scene);
        roof.position = new BABYLON.Vector3(x, height + 0.1, z);
        roof.material = this.materials.roof;
        roof.checkCollisions = true;
        this.meshes.push(roof);
    }
    
    createSimpleWallWithDoor(x, z, width, height, thickness, doorWidth) {
        const sideWidth = (width - doorWidth) / 2;
        
        // Left piece
        const left = BABYLON.MeshBuilder.CreateBox(`swall_l_${x}_${z}`, {
            width: sideWidth,
            height: height,
            depth: thickness
        }, this.scene);
        left.position = new BABYLON.Vector3(x - width/2 + sideWidth/2, height/2, z);
        left.material = this.materials.wall;
        left.checkCollisions = true;
        this.meshes.push(left);
        
        // Right piece
        const right = BABYLON.MeshBuilder.CreateBox(`swall_r_${x}_${z}`, {
            width: sideWidth,
            height: height,
            depth: thickness
        }, this.scene);
        right.position = new BABYLON.Vector3(x + width/2 - sideWidth/2, height/2, z);
        right.material = this.materials.wall;
        right.checkCollisions = true;
        this.meshes.push(right);
    }
    
    createBarn(x, z, width, depth) {
        const height = 4;
        
        // Floor
        const floor = BABYLON.MeshBuilder.CreateBox(`barnFloor_${x}_${z}`, {
            width: width,
            height: 0.15,
            depth: depth
        }, this.scene);
        floor.position = new BABYLON.Vector3(x, 0.075, z);
        floor.material = this.materials.dirt;
        floor.checkCollisions = true;
        this.meshes.push(floor);
        
        // Open front (no wall)
        // Back wall
        const backWall = BABYLON.MeshBuilder.CreateBox(`barnBack_${x}_${z}`, {
            width: width,
            height: height,
            depth: 0.3
        }, this.scene);
        backWall.position = new BABYLON.Vector3(x, height/2, z + depth/2);
        backWall.material = this.materials.wood;
        backWall.checkCollisions = true;
        this.meshes.push(backWall);
        
        // Side walls
        for (let side of [-1, 1]) {
            const sideWall = BABYLON.MeshBuilder.CreateBox(`barnSide_${x}_${z}_${side}`, {
                width: 0.3,
                height: height,
                depth: depth
            }, this.scene);
            sideWall.position = new BABYLON.Vector3(x + (width/2) * side, height/2, z);
            sideWall.material = this.materials.wood;
            sideWall.checkCollisions = true;
            this.meshes.push(sideWall);
        }
        
        // Dark metal roof
        const roof = BABYLON.MeshBuilder.CreateBox(`barnRoof_${x}_${z}`, {
            width: width + 2,
            height: 0.15,
            depth: depth + 2
        }, this.scene);
        roof.position = new BABYLON.Vector3(x, height, z);
        roof.material = this.materials.darkRoof;
        roof.checkCollisions = true;
        this.meshes.push(roof);
    }
    
    createTrees() {
        // Many trees around the property based on satellite image
        const treePositions = [
            // Around main house
            { x: -15, z: 10 }, { x: -18, z: 5 }, { x: -20, z: -5 },
            { x: 25, z: 10 }, { x: 30, z: 5 }, { x: 28, z: -10 },
            { x: 10, z: 15 }, { x: 5, z: 18 },
            
            // Around pool area
            { x: 15, z: -25 }, { x: -5, z: -25 }, { x: 0, z: -30 },
            
            // Along the road
            { x: -45, z: -30 }, { x: -45, z: -10 }, { x: -45, z: 10 },
            { x: -45, z: 30 }, { x: -45, z: 50 },
            
            // Around smaller houses
            { x: 10, z: 50 }, { x: -10, z: 50 }, { x: 40, z: 40 },
            { x: -60, z: 30 }, { x: -50, z: 20 },
            { x: -20, z: -50 }, { x: -10, z: -50 },
            { x: 50, z: 5 }, { x: 50, z: -5 },
            
            // Property edges (dense tree line)
            { x: -80, z: -60 }, { x: -70, z: -70 }, { x: -60, z: -65 },
            { x: 60, z: -60 }, { x: 70, z: -50 }, { x: 75, z: -40 },
            { x: 80, z: 20 }, { x: 75, z: 35 }, { x: 70, z: 50 },
            { x: -75, z: 60 }, { x: -65, z: 65 }, { x: -55, z: 70 },
            
            // Random scatter
            { x: 55, z: 25 }, { x: -30, z: 55 }, { x: 20, z: 65 },
            { x: -70, z: 0 }, { x: 65, z: -20 }, { x: -25, z: -65 },
        ];
        
        treePositions.forEach((pos, i) => {
            this.createTree(pos.x + Utils.random(-3, 3), pos.z + Utils.random(-3, 3), i);
        });
    }
    
    createTree(x, z, id) {
        const trunkHeight = Utils.random(3, 5);
        const trunkRadius = Utils.random(0.3, 0.5);
        const canopyRadius = Utils.random(3, 5);
        
        // Trunk
        const trunk = BABYLON.MeshBuilder.CreateCylinder(`trunk_${id}`, {
            diameter: trunkRadius * 2,
            height: trunkHeight
        }, this.scene);
        trunk.position = new BABYLON.Vector3(x, trunkHeight/2, z);
        trunk.material = this.materials.trunk;
        trunk.checkCollisions = true;
        this.meshes.push(trunk);
        
        // Canopy (sphere, slightly flattened)
        const canopy = BABYLON.MeshBuilder.CreateSphere(`canopy_${id}`, {
            diameter: canopyRadius * 2,
            segments: 8
        }, this.scene);
        canopy.position = new BABYLON.Vector3(x, trunkHeight + canopyRadius * 0.6, z);
        canopy.scaling = new BABYLON.Vector3(1, 0.7, 1);
        canopy.material = this.materials.foliage;
        canopy.checkCollisions = true;
        this.meshes.push(canopy);
        
        // Some trees have multiple canopy sections
        if (Math.random() > 0.5) {
            const canopy2 = BABYLON.MeshBuilder.CreateSphere(`canopy2_${id}`, {
                diameter: canopyRadius * 1.5,
                segments: 6
            }, this.scene);
            canopy2.position = new BABYLON.Vector3(
                x + Utils.random(-1, 1),
                trunkHeight + canopyRadius * 0.3,
                z + Utils.random(-1, 1)
            );
            canopy2.material = this.materials.foliage;
            this.meshes.push(canopy2);
        }
    }
    
    createProps() {
        // Barrels and crates near barn
        for (let i = 0; i < 5; i++) {
            const barrel = BABYLON.MeshBuilder.CreateCylinder(`barrel_${i}`, {
                diameter: 0.6,
                height: 1
            }, this.scene);
            barrel.position = new BABYLON.Vector3(
                -55 + Utils.random(-5, 5),
                0.5,
                -35 + Utils.random(-3, 3)
            );
            barrel.material = this.materials.wood;
            barrel.checkCollisions = true;
            this.meshes.push(barrel);
        }
        
        // Crates near houses
        const cratePositions = [
            { x: 30, z: 0 }, { x: -50, z: 20 }, { x: 40, z: 30 },
            { x: -10, z: -40 }, { x: 50, z: -5 }
        ];
        
        cratePositions.forEach((pos, i) => {
            const crate = BABYLON.MeshBuilder.CreateBox(`crate_${i}`, {
                width: Utils.random(0.8, 1.2),
                height: Utils.random(0.8, 1.2),
                depth: Utils.random(0.8, 1.2)
            }, this.scene);
            crate.position = new BABYLON.Vector3(pos.x, 0.5, pos.z);
            crate.rotation.y = Utils.random(0, Math.PI);
            crate.material = this.materials.wood;
            crate.checkCollisions = true;
            this.meshes.push(crate);
        });
        
        // Old tractor/vehicle near barn (simplified)
        const tractor = BABYLON.MeshBuilder.CreateBox("tractor", {
            width: 2,
            height: 1.5,
            depth: 4
        }, this.scene);
        tractor.position = new BABYLON.Vector3(-50, 0.75, -25);
        tractor.rotation.y = 0.3;
        tractor.material = this.materials.darkRoof;
        tractor.checkCollisions = true;
        this.meshes.push(tractor);
        
        // Fence posts along property
        for (let i = 0; i < 20; i++) {
            const post = BABYLON.MeshBuilder.CreateCylinder(`fencePost_${i}`, {
                diameter: 0.15,
                height: 1.2
            }, this.scene);
            
            // Place along edges
            const angle = (i / 20) * Math.PI * 2;
            const radius = 90;
            post.position = new BABYLON.Vector3(
                Math.cos(angle) * radius,
                0.6,
                Math.sin(angle) * radius
            );
            post.material = this.materials.wood;
            this.meshes.push(post);
        }
    }
    
    createSpawnPoints() {
        // Police spawns - near the road entrance
        for (let i = 0; i < 10; i++) {
            this.spawnPoints.police.push(new BABYLON.Vector3(
                -50 + Utils.random(-5, 5),
                2,
                Utils.random(-40, 40)
            ));
        }
        
        // Criminal spawns - spread around buildings
        const criminalSpawns = [
            { x: 0, z: 50 },    // North house
            { x: 35, z: 30 },   // NE house
            { x: -60, z: -35 }, // Barn
            { x: 45, z: 5 },    // East structure
            { x: -20, z: -50 }, // South house
            { x: 25, z: 0 },    // Main house area
            { x: 5, z: -25 },   // Pool area
            { x: -55, z: 20 },  // NW house
        ];
        
        criminalSpawns.forEach(spawn => {
            this.spawnPoints.criminal.push(new BABYLON.Vector3(
                spawn.x + Utils.random(-3, 3),
                2,
                spawn.z + Utils.random(-3, 3)
            ));
        });
        
        // Add more criminal spawns
        for (let i = 0; i < 2; i++) {
            this.spawnPoints.criminal.push(new BABYLON.Vector3(
                Utils.random(-30, 30),
                2,
                Utils.random(-30, 30)
            ));
        }
    }
    
    createLighting() {
        // Warm sunlight - rural afternoon
        const ambient = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, 1, 0), this.scene);
        ambient.intensity = 0.4;
        ambient.groundColor = new BABYLON.Color3(0.2, 0.18, 0.15);
        ambient.specular = new BABYLON.Color3(0.15, 0.15, 0.1);
        
        // Main sun - warm afternoon light
        const sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(-0.5, -0.7, -0.3), this.scene);
        sun.intensity = 2.0;
        sun.diffuse = new BABYLON.Color3(1, 0.95, 0.85);
        sun.specular = new BABYLON.Color3(1, 0.98, 0.9);
        
        // Shadow generator
        const shadowGenerator = new BABYLON.ShadowGenerator(4096, sun);
        shadowGenerator.usePercentageCloserFiltering = true;
        shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_HIGH;
        shadowGenerator.bias = 0.001;
        shadowGenerator.normalBias = 0.02;
        shadowGenerator.darkness = 0.25;
        
        // Add meshes to shadow caster
        this.meshes.slice(0, 100).forEach(mesh => {
            shadowGenerator.addShadowCaster(mesh);
            mesh.receiveShadows = true;
        });
        
        this.shadowGenerator = shadowGenerator;
        
        // Fill light (sky)
        const fillLight = new BABYLON.DirectionalLight("fill", new BABYLON.Vector3(0.3, -0.4, 0.6), this.scene);
        fillLight.intensity = 0.5;
        fillLight.diffuse = new BABYLON.Color3(0.8, 0.9, 1);
        fillLight.specular = new BABYLON.Color3(0, 0, 0);
    }
    
    createSkybox() {
        const skybox = BABYLON.MeshBuilder.CreateSphere("skybox", {
            diameter: 600,
            sideOrientation: BABYLON.Mesh.BACKSIDE
        }, this.scene);
        
        const skyMat = new BABYLON.StandardMaterial("skyMat", this.scene);
        skyMat.backFaceCulling = false;
        skyMat.disableLighting = true;
        
        // Rural sky - blue with some clouds
        const skyTexture = new BABYLON.DynamicTexture("skyTexture", { width: 512, height: 512 }, this.scene);
        const ctx = skyTexture.getContext();
        
        const gradient = ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#1e3a5f');    // Deep blue at top
        gradient.addColorStop(0.2, '#3d6a8a');  // Blue
        gradient.addColorStop(0.4, '#6a9fc0');  // Light blue
        gradient.addColorStop(0.6, '#8fc1d8');  // Sky blue
        gradient.addColorStop(0.75, '#b5d8e8'); // Pale blue
        gradient.addColorStop(0.9, '#d4e8f0');  // Horizon
        gradient.addColorStop(1, '#e8f0e8');    // Greenish horizon (vegetation)
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Add fluffy clouds
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 250 + 50;
            const size = Math.random() * 80 + 30;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(x, y, size, size * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        
        skyTexture.update();
        
        skyMat.emissiveTexture = skyTexture;
        skybox.material = skyMat;
        skybox.isPickable = false;
        
        this.meshes.push(skybox);
    }
    
    getPlayerSpawn(team) {
        const spawns = this.spawnPoints[team];
        return Utils.randomElement(spawns).clone();
    }
    
    getEnemySpawns(team) {
        const enemyTeam = team === 'police' ? 'criminal' : 'police';
        return [...this.spawnPoints[enemyTeam]];
    }
    
    dispose() {
        this.meshes.forEach(mesh => mesh.dispose());
        this.meshes = [];
    }
}
