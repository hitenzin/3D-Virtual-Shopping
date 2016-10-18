/* Variable declarations */
var container;
var camera, controls, scene, renderer;
var projector, mouse = { x: 0, y: 0 };
var targetList = [];
var floor;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
var rotatevar = false;
var position_x, position_y, position_z;
var clickedObject;

init();															// initializing function
animate();														// animating function

function init() {
	camera = new THREE.PerspectiveCamera(30, 					// creating perspective camera
		window.innerWidth / window.innerHeight, 1, 10000);

	camera.position.x = -70;									// setting the position and location
	camera.rotation = 10;										// of the camera
	scene = new THREE.Scene();									// creating the scene

	clickedObject = new THREE.Mesh(								// creating a non-existant object used to be able to
		new THREE.CubeGeometry(0,0,0), 							// click on the items of the store
		new THREE.MeshLambertMaterial());

	controls();													// function that creates controls of the camera							
	floor();												    // function that creates floor object 		
	shelves();													// function that creates shelf object 
	text();														// function that creates text used as aisle name 
	campbellsoup();
	loadSoda();
	loadBroccoli();												// function that loads a broccoli model
	loadPringles();												// function that loads pringles
	loadiPhone();												// function that loads a iPhone model 
	loadCamera();
	loadCameraTV();

	/* These functions return different types of cereal boxes */ 
	flakes();													
	fruitloops();
	luckycharms();

	scene.add(clickedObject);									// adds the object to the scene
	light();													// function that creates lighting above shelves 

	projector = new THREE.Projector();							// creates a projector object used to ...

	if (Detector.webgl)
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		alert("No WebGL support detected");

	renderer = new THREE.WebGLRenderer( { antialias: true } );	// creates a renderer object
	renderer.setClearColor( "black", 1 );
  	renderer.setSize( window.innerWidth, window.innerHeight );	// sets size of renderer(size of window browser)

  	container = document.getElementById( 'container' );
  	container.appendChild( renderer.domElement );
  	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'dblclick', onDoubleClick, false );
  	document.addEventListener( 'mousedown', onDocumentMouseDown, false ); 

	/* Creates statistics for web page, frames per sec */
  	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

}

/* Changes and updates screen size upon resizing */
function onWindowResize() {

  	camera.aspect = window.innerWidth / window.innerHeight;
  	camera.updateProjectionMatrix();

  	renderer.setSize( window.innerWidth, window.innerHeight );
  	render();
}

/* Controls animations of objects, rendering, and updating the screen */
function animate() {

	requestAnimationFrame( animate );
	controls.update();
	stats.update();
	render();
	update();
}

/* Creates the controls for selecting an object and rotating it */

function update()
{

	var rotateAngle = 0.05;

	if ( keyboard.pressed("A") )
		clickedObject.rotateY(-rotateAngle);

	if ( keyboard.pressed("D") )
		clickedObject.rotateY(rotateAngle);

	if ( keyboard.pressed("W") )
		clickedObject.rotateZ(-rotateAngle);

	if ( keyboard.pressed("S") )
		clickedObject.rotateZ(rotateAngle);

	if ( keyboard.pressed("A") && keyboard.pressed("W"))
		clickedObject.rotateX(-rotateAngle);

	if ( keyboard.pressed("W") && keyboard.pressed("D"))
		clickedObject.rotateX(rotateAngle);

	if ( keyboard.pressed("escape") )
	{
		clickedObject.position.set(position_x,position_y,position_z);
		clickedObject.rotation.set(0,0,0);
	}
		
	controls.update();
	stats.update();
}

/* Creates the scene through rendering the objects from the camera... */
function render() {

	renderer.render( scene, camera );
}

/* Function used to load image files */ 
function loadAndRender(filename) {
	return THREE.ImageUtils.loadTexture(filename, {}, render);
}

/* Function used to create controls for the camera */
function controls() {										
	controls = new THREE.OrbitControls( camera );			// creating controls object through using orbit controls library 
	controls.addEventListener( 'change', render );			// creates an event listener that will  
															// render upon the change event
	controls.maxPolarAngle = Math.PI/2; 					// maximum distance to rotate vertically
	controls.minPolarAngle = Math.PI/4;						// minimum distance to rotate vertically 
	controls.maxDistance = 150;								// maximum distance to zoom out
	controls.minDistance = 10;								// minimum distance to zoom in
	controls.zoomSpeed = 2;									// controls how fast to zoom in ...
	controls.keyPanSpeed = 20;								// controls the amount of pixels moved
															// per left/ right arrow push
	controls.target.set(7.625/2,15,0);						// ...
}

/* Creating a function that adds 3 spotlights to shine on the 1st shelf.
 */

function light() {											// function: initializes light

	var light = new THREE.SpotLight("white");				// creating the light object
	light.position.set(-70,30,50);							// setting position where the light points
	light.castShadow = true;								// setting option for shadows 
	scene.add(light);										// adding the light to the scene 

	light = new THREE.SpotLight("white");
	light.position.set(-40,50,30);
	light.castShadow = true;
	scene.add(light);

	light = new THREE.SpotLight("white");
	light.position.set(-40,50,-200);
	light.castShadow = true;
	scene.add(light);

}	
/* Creating a function that returns a floor object
 */ 
function floor() {

	var floorTexture = new THREE.ImageUtils.loadTexture(	// loading material/texture of the floor 
		'images/floor_tile.jpg' );
	floorTexture.wrapS = floorTexture.wrapT 				// ...
					   = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 100, 100 );					// ...
	
	var floorMaterial = new THREE.MeshPhongMaterial( 		// creating floor with mesh phong material
		{ map: floorTexture, side: THREE.DoubleSide } );    // (shiny material)
		
	var floorGeometry = new THREE.PlaneGeometry(			// creating the floor as a wide plane geometry
		1000, 1000, 1, 1);
		
	floor = new THREE.Mesh(floorGeometry, floorMaterial);	// creating a floor with plane geometry and
															// texture
	floor.rotation.x = Math.PI / 2;							// ... 
	floor.receiveShadow = true;								// ...
	scene.add(floor);										// adds floor to scene 
	
}

/* Function that returns a shelf object
 */ 
function shelves() {

	var shelves = new THREE.CubeGeometry(10,1,40);			// creating the shelf using cube geometry
	var shelveMaterial = 									// creating the shelf material using 
		new THREE.MeshLambertMaterial({color: 'brown'});	// brown lambert material 
	
	var shift_y  = 0.5;										// variable used to move up by 0.5 for next shelf
	
	/* for loop to create 3 shelves on the first case and add it to the scene */
	for(var i = 0; i < 3; i++) {
	
		var shelve = new THREE.Mesh(new THREE.CubeGeometry(10,1,40), new THREE.MeshLambertMaterial({color: 'brown'}));
		shelve.position.set(0,shift_y, -18);
		shift_y+= 12.5;
		scene.add(shelve);
		}	
		
	/* for loop to create 3 shelves on the second case and add it to the scene */
	var shift_y  = 0.5;
	for(var i = 0; i < 3; i++) {
	
		var shelve = new THREE.Mesh(new THREE.CubeGeometry(10,1,40), new THREE.MeshLambertMaterial({color: 'brown'}));
		shelve.position.set(0,shift_y, -65);
		shift_y+= 12.5;
		scene.add(shelve);
		}

	/* for loop to create 3 shelves on the third case and add it to the scene */
	var shift_y  = 0.5;
	for(var i = 0; i < 3; i++) {
	
		var shelve = new THREE.Mesh(new THREE.CubeGeometry(10,1,40), new THREE.MeshLambertMaterial({color: 'brown'}));
		shelve.position.set(0,shift_y, -112);
		shift_y+= 12.5;
		scene.add(shelve);
		}	
	
	/* creates the back of the shelf, using 3 cube geometries and brown lambert material */
	shift_z = -18;
	for(var i = 0; i < 3; i++){
		var shelveBack = new THREE.Mesh(new THREE.CubeGeometry(1,40,40), new THREE.MeshLambertMaterial({color: 'brown'}));
		shelveBack.position.set(5.5,20,shift_z);
		scene.add(shelveBack);
		shift_z-=47;
		}
}

/* Creates name of shelf */
function text(){

	var textGeo = new THREE.TextGeometry("Cereals" , {		// defines the text parameters: font, size and height
                font: 'helvetiker',
                size: 3.5,
                height: 1,

            });
	var material = new THREE.MeshBasicMaterial(				// creates the material of the font
		{color: 'brown'});
	var textMesh = new THREE.Mesh(textGeo, material); 		// creates the actual text with text material and font
	textMesh.rotation.y = (3/2)*Math.PI;					// 
	textMesh.position.set(6,41,-29);						// sets the position of the text above the shelf
	scene.add(textMesh);									// adds the title to the scene


	var textGeo = new THREE.TextGeometry("Food N Beverage" , {		    // defines the text parameters: font, size and height
                font: 'helvetiker',
                size: 3.5,
                height: 1,

            });
	var textMesh = new THREE.Mesh(textGeo, material); 		// creates the actual text with text material and font
	textMesh.rotation.y = (3/2)*Math.PI;					// 
	textMesh.position.set(6,41,-85);						// sets the position of the text above the shelf
	scene.add(textMesh);									// adds the title to the scene


	var textGeo = new THREE.TextGeometry("Electronics" , {  // defines the text parameters: font, size and height
                font: 'helvetiker',
                size: 3.5,
                height: 1,

            });
	var textMesh = new THREE.Mesh(textGeo, material); 		// creates the actual text with text material and font
	textMesh.rotation.y = (3/2)*Math.PI;					// 
	textMesh.position.set(6,41,-125);						// sets the position of the text above the shelf
	scene.add(textMesh);									// adds the title to the scene

}

/* Function that returns the fruitloops cereal box */
function fruitloops(){
	
	/* loading image files for the cereal box */
	var materials = [
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/cereal_back.jpg') } ), 
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/cereal_front.jpg') } ),
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/cereal_top.jpg') } ),
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/cereal_bottom.jpg') } ),
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/cereal_right.jpg') } ),
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/cereal_left.jpg') } ),
	];
	
	/* using a for loop to produce 5 copies of the cereal box */
	for (var i = 0; i < 5; i++) {
		var cereals = new THREE.Geometry();
		var cereal = new THREE.Mesh( new THREE.CubeGeometry(2.75,11,7.625) );
		THREE.GeometryUtils.merge(cereals, cereal);
		Mesh = new THREE.Mesh(cereals, new THREE.MeshFaceMaterial(materials));
		Mesh.position.set(-1,13/2,-i*8-2);
		Mesh.castShadow = true;
		Mesh.receiveShadow = true;
		targetList.push(Mesh);
		scene.add(Mesh);
	}
}
/* Function that returns the luckycharms cereal box */
function luckycharms(){
	
	/* loading image files for the cereal box */
	var materials = [
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/2_cereal_back.jpg') } ), 
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/2_cereal_front.jpg') } ),
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/2_cereal_top.jpg') } ),
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/2_cereal_bottom.jpg') } ),
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/2_cereal_right.jpg') } ),
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/2_cereal_left.jpg') } ),
	];
	
	/* using a for loop to produce 5 copies of the cereal box */
	for (var i = 0; i < 5; i++) {
		var cereals = new THREE.Geometry();
		var cereal = new THREE.Mesh( new THREE.CubeGeometry(2.75,11,7.625) );
		THREE.GeometryUtils.merge(cereals, cereal);
		Mesh = new THREE.Mesh(cereals, new THREE.MeshFaceMaterial(materials));
		Mesh.position.set(-0.5,3*(12.5/2),-i*8-2);
		Mesh.castShadow = true;
		Mesh.receiveShadow = true;
		targetList.push(Mesh);
		scene.add(Mesh);
	}
}

/* Function that returns the flakes cereal box */
function flakes(){

	/* loading image files for the cereal box */
	var materials = [
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/3_cereal_back.gif') } ), 
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/3_cereal_front.gif') } ),
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/3_cereal_top.gif') } ),
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/3_cereal_bottom.gif') } ),
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/3_cereal_right.gif') } ),
	    new THREE.MeshPhongMaterial( { map: loadAndRender('images/3_cereal_left.gif') } ),
	];
	
	/* using a for loop to produce 5 copies of the cereal box */
	for (var i = 0; i < 5; i++) {
		var cereals = new THREE.Geometry();
		var cereal = new THREE.Mesh( new THREE.CubeGeometry(2.75,11,7.625) );
		THREE.GeometryUtils.merge(cereals, cereal);
		Mesh = new THREE.Mesh(cereals, new THREE.MeshFaceMaterial(materials));
		Mesh.position.set(0,5*(12.5/2),-i*8-2);
		Mesh.castShadow = true;
		Mesh.receiveShadow = true;
		targetList.push(Mesh);
		scene.add(Mesh);
	}
}


/**************** Need for texture, used several times for every texturing ************/
var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {

	console.log( item, loaded, total );
	
	};
/**************************************************************************************/

function loadPringles(){

	// texture
	var texturePringles = new THREE.Texture();

	var loader = new THREE.ImageLoader( manager );
		loader.load( 'images/pringles_texture.jpg', function ( image ) {

			texturePringles.image = image;
			texturePringles.needsUpdate = true;
		} );

	    var loader = new THREE.OBJLoader();
	    
	    // model: pringle 1
	    loader.load('PringlesDosefinal.obj', function (geometry) {

	    	geometry.traverse(function (child) {
	    		if(child instanceof THREE.Mesh) {
	    			child.material.map = texturePringles;
	    		}
	    	});

	        geometry.scale.set(1, 1.3, 1);
	        geometry.position.set(-1,29,-64)
	        geometry.rotation.x = Math.PI/2;
	        geometry.rotation.y = 3*Math.PI/2;
	        geometry.rotation.z = Math.PI/2;
	        targetList.push(geometry);
	        scene.add(geometry);
	     }); 

	     // model: pringle 2
	    loader.load('PringlesDosefinal.obj', function (geometry) {

	    	geometry.traverse(function (child) {
	    		if(child instanceof THREE.Mesh) {
	    			child.material.map = texturePringles;
	    		}
	    	});

	        geometry.scale.set(1, 1.3, 1);
	        geometry.position.set(-1,29,-70)
	        geometry.rotation.x = Math.PI/2;
	        geometry.rotation.y = 3*Math.PI/2;
	        geometry.rotation.z = Math.PI/2;
	        targetList.push(geometry);
	        scene.add(geometry);
	     }); 

	    // model: pringle 3
	    loader.load('PringlesDosefinal.obj', function (geometry) {

	    	geometry.traverse(function (child) {
	    		if(child instanceof THREE.Mesh) {
	    			child.material.map = texturePringles;
	    		}
	    	});

	        geometry.scale.set(1, 1.3, 1);
	        geometry.position.set(-1,29,-76)
	        geometry.rotation.x = Math.PI/2;
	        geometry.rotation.y = 3*Math.PI/2;
	        geometry.rotation.z = Math.PI/2;
	        targetList.push(geometry);
	        scene.add(geometry);
	     }); 

	    // model: pringle 4
	    loader.load('PringlesDosefinal.obj', function (geometry) {

	    	geometry.traverse(function (child) {
	    		if(child instanceof THREE.Mesh) {
	    			child.material.map = texturePringles;
	    		}
	    	});

	        geometry.scale.set(1, 1.3, 1);
	        geometry.position.set(-1,29,-82)
	        geometry.rotation.x = Math.PI/2;
	        geometry.rotation.y = 3*Math.PI/2;
	        geometry.rotation.z = Math.PI/2;
	        targetList.push(geometry);
	        scene.add(geometry);
	     }); 
}

function loadBroccoli(){

	// texture
	var textureBroccoli = new THREE.Texture();

	var loader = new THREE.ImageLoader( manager );
		loader.load( 'images/Broccoli_texture.jpg', function ( image ) {

			textureBroccoli.image = image;
			textureBroccoli.needsUpdate = true;
		} );

	    var loader = new THREE.OBJLoader();

	    // model 1
	    loader.load('broccoli.obj', function (geometry) {

	    	geometry.traverse(function (child) {
	    		if(child instanceof THREE.Mesh) {
	    			child.material.map = textureBroccoli;
	    		}
	    	});

	        geometry.scale.set(1, 1, 1);
	        geometry.position.set(-1,26,-50);
	        geometry.rotation.x = Math.PI/2;
	        geometry.rotation.y = 3*Math.PI/2;
	        geometry.rotation.z = Math.PI/2;
	        targetList.push(geometry);
	        scene.add(geometry);
	     }); 
	    
	    // model 2
	    loader.load('broccoli.obj', function (geometry) {

	    	geometry.traverse(function (child) {
	    		if(child instanceof THREE.Mesh) {
	    			child.material.map = textureBroccoli;
	    		}
	    	});

	        geometry.scale.set(1, 1, 1);
	        geometry.position.set(-1,26,-57)
	        geometry.rotation.x = Math.PI/2;
	        geometry.rotation.y = 3*Math.PI/2;
	        geometry.rotation.z = Math.PI/2;
	        targetList.push(geometry);
	        scene.add(geometry);
	    }); 
		
}

function loadSoda(){

	/*************** soda can 1: Regular Coke **************/

	// texture
	var textureCoke = new THREE.Texture();

	var loader = new THREE.ImageLoader( manager );
		loader.load( 'images/coke_texture.jpg', function ( image ) {

			textureCoke.image = image;
			textureCoke.needsUpdate = true;
		} );

	var loader = new THREE.OBJLoader();
    
    // model: coke 1
	loader.load('can.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureCoke;
    		}
    	});

        geometry.scale.set(4, 4, 4);
        geometry.position.set(-1,15.5,-48);
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = 3*Math.PI/2;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

	// model: coke 2
	var loader = new THREE.OBJLoader();
	loader.load('can.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureCoke;
    		}
    	});

        geometry.scale.set(4, 4, 4);
        geometry.position.set(-1,15.5,-52);
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = 3*Math.PI/2;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

	// model: coke 3
	var loader = new THREE.OBJLoader();
	loader.load('can.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureCoke;
    		}
    	});

        geometry.scale.set(4, 4, 4);
        geometry.position.set(-1,15.5,-56);
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = 3*Math.PI/2;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

    /************ soda can 2: Diet Coke *******************/

    // texture
	var textureDietCoke = new THREE.Texture();

	var loader = new THREE.ImageLoader( manager );
		loader.load( 'images/dietCoke_texture.jpg', function ( image ) {

			textureDietCoke.image = image;
			textureDietCoke.needsUpdate = true;
		} );

	// model: Diet Coke 1
	var loader = new THREE.OBJLoader();
    loader.load('can.obj', function (geometry) {     

		geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureDietCoke;
    		}
    	});

        geometry.scale.set(4, 4, 4);
        geometry.position.set(-1,15.5,-61)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = 3*Math.PI/2;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

    // model: Diet Coke 2
	var loader = new THREE.OBJLoader();
    loader.load('can.obj', function (geometry) {     

		geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureDietCoke;
    		}
    	});

        geometry.scale.set(4, 4, 4);
        geometry.position.set(-1,15.5,-65)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = 3*Math.PI/2;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

    // model: Diet Coke 3
	var loader = new THREE.OBJLoader();
    loader.load('can.obj', function (geometry) {     

		geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureDietCoke;
    		}
    	});

        geometry.scale.set(4, 4, 4);
        geometry.position.set(-1,15.5,-69)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = 3*Math.PI/2;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

 	/************* juice bottle *********************/
	 // texture
	var textureJuiceBottle = new THREE.Texture();

	var loader = new THREE.ImageLoader( manager );
		loader.load( 'images/bottle_texture.jpg', function ( image ) {

		textureJuiceBottle.image = image;
		textureJuiceBottle.needsUpdate = true;
	} );

	// model: Juice Bottle 1
	var loader = new THREE.OBJLoader();
    loader.load('bottle.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureJuiceBottle;
    		}
    	});

    	geometry.scale.set(0.025, 0.025, 0.025);
        geometry.position.set(-1,13.5,-74)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = 3*Math.PI/2;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 


    // model: Juice Bottle 2
	var loader = new THREE.OBJLoader();
    loader.load('bottle.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureJuiceBottle;
    		}
    	});

        geometry.scale.set(0.025, 0.025, 0.025);
        geometry.position.set(-1,13.5,-78)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = 3*Math.PI/2;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

    // model: Juice Bottle 3
	var loader = new THREE.OBJLoader();
    loader.load('bottle.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureJuiceBottle;
    		}
    	});

        geometry.scale.set(0.025, 0.025, 0.025);
        geometry.position.set(-1,13.5,-82)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = 3*Math.PI/2;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

}	// function loadSoda() ends	


function campbellsoup(){

	var soupGeom = new THREE.Geometry();
	var soupLids = new THREE.Geometry();

	var soupLid = new THREE.Mesh(new THREE.CircleGeometry(2,60));
	var soup = new THREE.Mesh( new THREE.CylinderGeometry( 2, 2, 4.5, 60, 1, true ));


	var zmov =4.2;
	for (var i = 0; i < 9; i++) {

			soup.position.set(-1,3.25,-86+zmov);
			soup.rotation.set(0,2,0);
			THREE.GeometryUtils.merge( soupGeom, soup );

			soupLid.position.set(-1, 5.475,-86+zmov);
			soupLid.rotation.set(3*Math.PI/2,0,0);
			THREE.GeometryUtils.merge( soupLids, soupLid );

			soupLid.position.set(-1, 0,-86+zmov);
			soupLid.rotation.set(3*Math.PI/2,0,0);
			THREE.GeometryUtils.merge( soupLids, soupLid );

			zmov+=4.2;
		}


	var soupLidMesh = new THREE.Mesh(soupLids, new THREE.MeshPhongMaterial( { map: loadAndRender('images/soup_top.jpg') } ));
	soupLidMesh.castShadow = true;
	soupLidMesh.receiveShadow = true;
	targetList.push(soupLidMesh);
	scene.add(soupLidMesh);
	
	
	var soupCanMesh = new THREE.Mesh(soupGeom, new THREE.MeshPhongMaterial( { map: loadAndRender('images/soup.jpg') } ));
	soupCanMesh.castShadow = true;
	soupCanMesh.receiveShadow = true;
	targetList.push(soupCanMesh);
	scene.add(soupCanMesh);

}



function loadiPhone(){

	// texture iphone5 black
	var textureBlack = new THREE.Texture();

	var loader = new THREE.ImageLoader( manager );
		loader.load( 'images/iphone_bg_black.jpg', function ( image ) {

			textureBlack.image = image;
			textureBlack.needsUpdate = true;
		} );

	// model: iphone5 black 1
    var loader = new THREE.OBJLoader();
    loader.load('iPhone5.obj', function (geometry) {
    	
    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureBlack;
    		}
    	});

        geometry.scale.set(.008, .008, .01);
        geometry.position.set(-2,30,-95)
        geometry.rotation.x = Math.PI;
        geometry.rotation.y = Math.PI/2;
        geometry.rotation.z = Math.PI;
        targetList.push(geometry);
        scene.add(geometry);
    });

    // model: iphone5 black 2
    var loader = new THREE.OBJLoader();
    loader.load('iPhone5.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureBlack;
    		}
    	});

        geometry.scale.set(.008, .008, .01);
        geometry.position.set(-2,30,-100)
        geometry.rotation.x = Math.PI;
        geometry.rotation.y = Math.PI/2;
        geometry.rotation.z = Math.PI;
        targetList.push(geometry);
        scene.add(geometry);
    });
	
	// model: iphone5 black 3
	var loader = new THREE.OBJLoader();
    loader.load('iPhone5.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureBlack;
    		}
    	});

        geometry.scale.set(.008, .008, .01);
        geometry.position.set(-2,30,-105)
        geometry.rotation.x = Math.PI;
        geometry.rotation.y = Math.PI/2;
        geometry.rotation.z = Math.PI;
        targetList.push(geometry);
        scene.add(geometry);
    });

    // model: iphone5 black 4
	var loader = new THREE.OBJLoader();
    loader.load('iPhone5.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureBlack;
    		}
    	});

        geometry.scale.set(.008, .008, .01);
        geometry.position.set(-2,30,-110)
        geometry.rotation.x = Math.PI;
        geometry.rotation.y = Math.PI/2;
        geometry.rotation.z = Math.PI;
        targetList.push(geometry);
        scene.add(geometry);
    });


    // texture iphone5 white
	var textureWhite = new THREE.Texture();

	var loader = new THREE.ImageLoader( manager );
		loader.load( 'images/iphone_bg_white.jpg', function ( image ) {

			textureWhite.image = image;
			textureWhite.needsUpdate = true;
		} );

	// model: iphone5 white 1
    var loader = new THREE.OBJLoader();
    loader.load('iPhone5.obj', function (geometry) {
    	
    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureWhite;
    		}
    	});

        geometry.scale.set(.008, .008, .01);
        geometry.position.set(-2,30,-115)
        geometry.rotation.x = Math.PI;
        geometry.rotation.y = Math.PI/2;
        geometry.rotation.z = Math.PI;
        targetList.push(geometry);
        scene.add(geometry);
    });

    // model: iphone5 white 2
    var loader = new THREE.OBJLoader();
    loader.load('iPhone5.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureWhite;
    		}
    	});

        geometry.scale.set(.008, .008, .01);
        geometry.position.set(-2,30,-120)
        geometry.rotation.x = Math.PI;
        geometry.rotation.y = Math.PI/2;
        geometry.rotation.z = Math.PI;
        targetList.push(geometry);
        scene.add(geometry);
    });
	
	// model: iphone5 white 3
	var loader = new THREE.OBJLoader();
    loader.load('iPhone5.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureWhite;
    		}
    	});

        geometry.scale.set(.008, .008, .01);
        geometry.position.set(-2,30,-125)
        geometry.rotation.x = Math.PI;
        geometry.rotation.y = Math.PI/2;
        geometry.rotation.z = Math.PI;
        targetList.push(geometry);
        scene.add(geometry);
    });

/* Controls animations of objects, rendering, and updating the screen */
function animate() {
	
	requestAnimationFrame( animate );
	controls.update();
	stats.update();
	render();
	update();
}

    // model: iphone5 white 4
	var loader = new THREE.OBJLoader();
    loader.load('iPhone5.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureWhite;
    		}
    	});

        geometry.scale.set(.008, .008, .01);
        geometry.position.set(-2,30,-130)
        geometry.rotation.x = Math.PI;
        geometry.rotation.y = Math.PI/2;
        geometry.rotation.z = Math.PI;
        targetList.push(geometry);
        scene.add(geometry);
    });
}



function loadCamera(){

	// texture 
	var textureCamera = new THREE.Texture();
				var loaderCamera = new THREE.ImageLoader( manager );
				loaderCamera.load( 'images/nikon.jpg', function ( image ) {

					textureCamera.image = image;
					//textureCamera.needsF = true;
					textureCamera.needsUpdate = true;

				} );

	// camera model 1
	var loader = new THREE.OBJLoader();
    loader.load('camera.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureCamera;
    		}
    	});

        geometry.scale.set(20, 20, 20);
        geometry.position.set(2.5,13.5,-97)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = 3*Math.PI/2;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 


	// camera model 2
	var loader = new THREE.OBJLoader();
    loader.load('camera.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureCamera;
    		}
    	});

        geometry.scale.set(20, 20, 20);
        geometry.position.set(2.5,13.5,-105)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = 3*Math.PI/2;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 


	// camera model 3
	var loader = new THREE.OBJLoader();
    loader.load('camera.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureCamera;
    		}
    	});

        geometry.scale.set(20, 20, 20);
        geometry.position.set(2.5,13.5,-113)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = 3*Math.PI/2;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

    // camera model 4
	var loader = new THREE.OBJLoader();
    loader.load('camera.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureCamera;
    		}
    	});

        geometry.scale.set(20, 20, 20);
        geometry.position.set(2.5,13.5,-121)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = 3*Math.PI/2;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

    // camera model 5
	var loader = new THREE.OBJLoader();
    loader.load('camera.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureCamera;
    		}
    	});

        geometry.scale.set(20, 20, 20);
        geometry.position.set(2.5,13.5,-129)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = 3*Math.PI/2;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

}

function loadCameraTV(){

	// texture 
	var textureCamera = new THREE.Texture();
				var loaderCamera = new THREE.ImageLoader( manager );
				loaderCamera.load( 'images/camera_texture2.jpg', function ( image ) {

					textureCamera.image = image;
					textureCamera.needsUpdate = true;

				} );

	// video camera model 1
	var loader = new THREE.OBJLoader();
    loader.load('cameraTV.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureCamera;
    		}
    	});

        geometry.scale.set(5, 5, 5);
        geometry.position.set(0, 1,-97)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = Math.PI;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

    // video camera model 2
    loader.load('cameraTV.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureCamera;
    		}
    	});

        geometry.scale.set(5, 5, 5);
        geometry.position.set(0,1,-105)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = Math.PI;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

    // video camera model 3
    loader.load('cameraTV.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureCamera;
    		}
    	});

        geometry.scale.set(5, 5, 5);
        geometry.position.set(0,1,-113)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = Math.PI;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

    // video camera model 4
    loader.load('cameraTV.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureCamera;
    		}
    	});

        geometry.scale.set(5, 5, 5);
        geometry.position.set(0,1,-121)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = Math.PI;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

    // video camera model 5
    loader.load('cameraTV.obj', function (geometry) {

    	geometry.traverse(function (child) {
    		if(child instanceof THREE.Mesh) {
    			child.material.map = textureCamera;
    		}
    	});

        geometry.scale.set(5, 5, 5);
        geometry.position.set(0,1,-129)
        geometry.rotation.x = Math.PI/2;
        geometry.rotation.y = Math.PI;
        geometry.rotation.z = Math.PI/2;
        targetList.push(geometry);
        scene.add(geometry);
    }); 

}



function onDocumentMouseDown( event ) 
{
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1; 	//calculate the x position clicked
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1; //calculate the y position clicked

	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );		//create a 3D vector 
	projector.unprojectVector( vector, camera );				//convert clicked position on the screen to
																//coordinate in Three js scene
	
	var ray = new THREE.Raycaster( camera.position,				//send an array in the world from the position clicked in the direction of camera		 
			vector.sub( camera.position ).normalize() );		

	var intersects = ray.intersectObjects( targetList );		//create an array containing all objects in the scene with which the ray intersects
	
	if ( intersects.length > 0 )
	{															//if array is not empty means we intersected an object
		if(clickedObject != intersects[0].object)				//new object is not the previous object
		{
			clickedObject.position.set(							//set the position of the old object as its default
				position_x,position_y,position_z);
			
			clickedObject.rotation.set(0,0,0);					//set the rotation of the old object as its default
			clickedObject = intersects[ 0 ].object;				//set the new clickedObject variable as the new object
			position_x = clickedObject.position.x;				//get the default x position
			position_y = clickedObject.position.y;				//get the default y position
			position_z = clickedObject.position.z;				//get the dafault z position
		}
	
	}
}

function onDoubleClick( event ) 
{
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;	//calculate the x position clicked
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1; //calculate the y position clicked

	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );		//create a 3D vector 
	projector.unprojectVector( vector, camera );				//convert clicked position on the screen to
																//coordinate in Three js scene
	var ray = new THREE.Raycaster( camera.position, 
			vector.sub( camera.position ).normalize() );		//send an array in the world from the position clicked in the direction of camera

	var intersects = ray.intersectObjects( targetList , true );	//create an array containing all objects in the scene with which the ray intersects
	if ( intersects.length > 0 )								//if array is not empty means we intersected an object
	{
		if(clickedObject != intersects[0].object)				//new object is not the previous object
		{
			clickedObject.position.set(							//set the position of the old object as its default
				position_x,position_y,position_z);
			clickedObject.rotation.set(0,0,0);					//set the rotation of the old object as its default
			clickedObject = intersects[ 0 ].object;				//set the new clickedObject variable as the new object
			position_x = clickedObject.position.x;				//get the default x position
			position_y = clickedObject.position.y;				//get the default y position
			position_z = clickedObject.position.z;				//get the dafault z position
			console.log(intersects[0].object.id); 
		}
	
	}
	clickedObject.position.set(-20,position_y,position_z);		//bring the clicked object out 
	clickedObject.rotation.set(0,0,0);							//set the rotation to default
	if(clickedObject.id == 232 || clickedObject.id == 235 || 
	   clickedObject.id == 238 || clickedObject.id == 241 ||
	   clickedObject.id == 244)
	{
		clickedObject.position.set(position_x,position_y, 1);	//bring the clicked object out 
		clickedObject.rotation.set(0,0,0);					    //set the rotation to default
	}

	if(clickedObject.id == 247 || clickedObject.id == 250 || 
	   clickedObject.id == 253 || clickedObject.id == 256 ||
	   clickedObject.id == 259)
	{
	clickedObject.position.set(position_x, -1.5, position_z);	//bring the clicked object out 
	clickedObject.rotation.set(0,0,0);							//set the rotation to default
	}

	if(clickedObject.id == 144 || clickedObject.id == 155 || 
	   clickedObject.id == 166 || clickedObject.id == 177 ||
	   clickedObject.id == 188 || clickedObject.id == 199 ||
	   clickedObject.id == 210 || clickedObject.id == 221 ||
	   clickedObject.id == 232 || clickedObject.id == 243)
	{
	clickedObject.position.set(position_x, position_y, -1000);  //bring the clicked object out 
	clickedObject.rotation.set(0,0,0);							//set the rotation to default
	}

	if(clickedObject.id == 113 || clickedObject.id == 117)
	{
	clickedObject.position.set(position_x, position_y, 15);		//bring the clicked object out 
	clickedObject.rotation.set(0,0,0);							//set the rotation to default
	}

}


