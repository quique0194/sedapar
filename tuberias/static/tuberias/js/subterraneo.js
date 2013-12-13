if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer;
var projector, plane, cube;
var mouse2D, mouse3D, raycaster,
rollOveredFace, isShiftDown = false,
theta = 300, isCtrlDown = false;
var canvasWidth = 540;
var canvasHeight = 600;

var rollOverMesh, rollOverMaterial;
var voxelPosition = new THREE.Vector3(), tmpVec = new THREE.Vector3(), normalMatrix = new THREE.Matrix3();
var cubeGeo, cubeMaterial;
var i, intersector;

var cont = 0;


function convertir(punto)
{
    var temp = punto*100000000000000;
    console.log(temp);
}

function init() {


    camera = new THREE.PerspectiveCamera( 45, canvasWidth / canvasHeight, 1, 10000 );
    camera.position.y = 800;
    camera.position.x = 1400 * Math.sin( THREE.Math.degToRad( theta ) );
        camera.position.z = 1400 * Math.cos( THREE.Math.degToRad( theta ) );

    scene = new THREE.Scene();

    // cubes

    cubeGeo = new THREE.CubeGeometry( 30, 30, 30 );
    cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x922929, ambient: 0x00ff80, shading: THREE.FlatShading} );
    cubeMaterial.ambient = cubeMaterial.color;


    cilindroGeo = new THREE.CylinderGeometry(10, 10, 300, 20, 20, false);
    cilindroMaterial = new THREE.MeshNormalMaterial();
    var cilindro = new THREE.Mesh(cilindroGeo,cilindroMaterial);
    cilindro.overdraw = true;
    cilindro.position.set(0,0,0);
    cilindro.rotation.x = 1.55;
    scene.add(cilindro);



    cilindroGeo2 = new THREE.CylinderGeometry(10, 10, 300, 20, 20, false);
    cilindroMaterial2 = new THREE.MeshNormalMaterial();
    var cilindro2 = new THREE.Mesh(cilindroGeo,cilindroMaterial);
    cilindro2.overdraw = true;
    cilindro2.position.set(150,0,150);
    cilindro2.rotation.x = 1.55;
    cilindro2.rotation.z = 1.55;
    scene.add(cilindro2);

    var voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
        voxel.position.set(0, 0.0, 150);
        scene.add(voxel); 


    // picking

    projector = new THREE.Projector();

    // grid

    var size = 400, step = 20;

    var geometry = new THREE.Geometry();

    for ( var i = - size; i <= size; i += step ) {

        geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
        geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

        geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
        geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

    }

    var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );

    var line = new THREE.Line( geometry, material );
    line.type = THREE.LinePieces;
    scene.add( line );

    plane = new THREE.Mesh( new THREE.PlaneGeometry( 1000, 1000 ), new THREE.MeshBasicMaterial() );
    plane.rotation.x = - Math.PI / 2;
    plane.visible = false;
    scene.add( plane );

    mouse2D = new THREE.Vector3( 0, 10000, 0.5 );

    // Lights

    var ambientLight = new THREE.AmbientLight( 0x606060 );
    scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
    scene.add( directionalLight );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setSize( canvasWidth, canvasHeight );

    


    document.getElementById("subterraneo").appendChild(renderer.domElement);
    
    document.getElementById("subterraneo").addEventListener( 'mousemove', onDocumentMouseMove, false );
    //document.getElementById("subterraneo").addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'keydown', onDocumentKeyDown, false );
    document.addEventListener( 'keyup', onDocumentKeyUp, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( canvasWidth, canvasHeight );

}

function getRealIntersector( intersects ) {

    for( i = 0; i < intersects.length; i++ ) {

        intersector = intersects[ i ];

        if ( intersector.object != rollOverMesh ) {

            return intersector;

        }

    }

    return null;

}

function setVoxelPosition( intersector ) {

    normalMatrix.getNormalMatrix( intersector.object.matrixWorld );

    tmpVec.copy( intersector.face.normal );
    tmpVec.applyMatrix3( normalMatrix ).normalize();

    voxelPosition.addVectors( intersector.point, tmpVec );

    voxelPosition.x = Math.floor( voxelPosition.x / 40 ) * 40 + 20;
    voxelPosition.y = Math.floor( voxelPosition.y / 40 ) * 40 + 20;
    voxelPosition.z = Math.floor( voxelPosition.z / 40 ) * 40 + 20;

}

function onDocumentMouseMove( event ) {

    event.preventDefault();
    var offset = $("#subterraneo").offset();
    mouse2D.x = ( (event.clientX - offset.left) / canvasWidth ) * 2 - 1;
    mouse2D.y = - ( (event.clientY - offset.top) / canvasHeight ) * 2 + 1;
    //console.log(mouse2D.x);

}

/*function onDocumentMouseDown( event ) {
    console.log("MouseDown");
    event.preventDefault();

    var intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {

        intersector = getRealIntersector( intersects );

        // delete cube

        if ( isCtrlDown ) {

            if ( intersector.object != plane ) {

                scene.remove( intersector.object );

            }

        // create cube

        } else {

            intersector = getRealIntersector( intersects );
            setVoxelPosition( intersector );

            var voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
            voxel.position.copy( voxelPosition );
            voxel.matrixAutoUpdate = false;
            voxel.updateMatrix();
            scene.add( voxel );

        }

    }
}*/

function onDocumentKeyDown( event ) {
    console.log("keyDown");
    switch( event.keyCode ) {

        case 16: isShiftDown = true; break;
        case 17: isCtrlDown = true; break;

    }

}

function onDocumentKeyUp( event ) {
    console.log("keyDown");
    switch ( event.keyCode ) {

        case 16: isShiftDown = false; break;
        case 17: isCtrlDown = false; break;

    }

}

    //

    function animate() {
        //console.log("animate");
        requestAnimationFrame( animate );

        render();

    }

    function render() {

        //console.log("render");


        if ( isShiftDown ) {
            console.log("shit");

            theta += mouse2D.x * 1.5;

        }

        raycaster = projector.pickingRay( mouse2D.clone(), camera );

        
        //console.log(theta);
        camera.position.x = 1400 * Math.sin( THREE.Math.degToRad( theta ) );
        camera.position.z = 1400 * Math.cos( THREE.Math.degToRad( theta ) );

        camera.lookAt( scene.position );

        renderer.render( scene, camera );

    }

    function graficar_tuberia(x1,y1,x2,y2)
    {
        console.log("graficando tuberia");
        cilindroGeo = new THREE.CylinderGeometry(10, 10, tamaño_tubo(x1,y1,x2,y2), 20, 20, false);
        cilindroMaterial = new THREE.MeshNormalMaterial();
        var cilindro = new THREE.Mesh(cilindroGeo,cilindroMaterial);
        cilindro.overdraw = true;
        cilindro.position.set((x1+x2)/2,0,(y1+y2)/2);
        cilindro.rotation.x = 1.55;
        if (Math.abs(giro_tubo(x1,y1,x2,y2)) <2) 
        {
            cilindro.rotation.z = 1.55;
        }
        //giro_tubo(x1,x2);
        scene.add(cilindro);
        cont+=20;

    }
    function tamaño_tubo(x1,y1,x2,y2)
    {
        return Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));
    }

    function giro_tubo(x1,y1,x2,y2)
    {
        var pendiente = (y2-y1)/(x2-x1);
        var angulo = Math.atan(pendiente);

        var tmp = 1.55 * (Math.abs(y1-y2)/400);
        var t = 1.55 * (angulo/(Math.PI/2));
        console.log("diferencia:" + pendiente);
        return pendiente;
    }

    function clear_scene()
    {
        scene = new THREE.Scene();
    }

    function webGLStart()
    {
        init();
        //animate();
    }


$(window).load(function(){
    webGLStart();
});

