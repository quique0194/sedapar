if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, scene, renderer;
var projector, plane, cube;
var mouse2D, mouse3D, raycaster,
rollOveredFace, isShiftDown = false,
theta = 45 * 0.5, isCtrlDown = false;
var canvasWidth = 540;
var canvasHeight = 600;

var rollOverMesh, rollOverMaterial;
var voxelPosition = new THREE.Vector3(), tmpVec = new THREE.Vector3(), normalMatrix = new THREE.Matrix3();
var cubeGeo, cubeMaterial;
var i, intersector;


function init() {


    camera = new THREE.PerspectiveCamera( 45, canvasWidth / canvasHeight, 1, 10000 );
    camera.position.y = 800;

    scene = new THREE.Scene();

    // roll-over helpers

    rollOverGeo = new THREE.CubeGeometry( 40, 40, 40 );
    rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
    rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
    scene.add( rollOverMesh );

    // cubes

    cubeGeo = new THREE.CubeGeometry( 40, 40, 40 );
    cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x922929, ambient: 0x00ff80, shading: THREE.FlatShading} );
    cubeMaterial.ambient = cubeMaterial.color;

    // picking

    projector = new THREE.Projector();

    // grid

    var size = 400, step = 40;

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
    
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
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

    mouse2D.x = ( event.clientX / canvasWidth ) * 2 - 1;
    mouse2D.y = - ( event.clientY / canvasHeight ) * 2 + 1;

}

function onDocumentMouseDown( event ) {

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
}

function onDocumentKeyDown( event ) {

    switch( event.keyCode ) {

        case 16: isShiftDown = true; break;
        case 17: isCtrlDown = true; break;

    }

}

function onDocumentKeyUp( event ) {

    switch ( event.keyCode ) {

        case 16: isShiftDown = false; break;
        case 17: isCtrlDown = false; break;

    }

}

    //

    function animate() {

        requestAnimationFrame( animate );

        render();

    }

    function render() {

        if ( isShiftDown ) {

            theta += mouse2D.x * 1.5;

        }

        raycaster = projector.pickingRay( mouse2D.clone(), camera );

        var intersects = raycaster.intersectObjects( scene.children );

        if ( intersects.length > 0 ) {

            intersector = getRealIntersector( intersects );
            if ( intersector ) {

                setVoxelPosition( intersector );
                rollOverMesh.position = voxelPosition;

            }

        }

        camera.position.x = 1400 * Math.sin( THREE.Math.degToRad( theta ) );
        camera.position.z = 1400 * Math.cos( THREE.Math.degToRad( theta ) );

        camera.lookAt( scene.position );

        renderer.render( scene, camera );

    }
    function webGLStart()
    {
        init();
        animate();
    }


$(window).load(function(){
    webGLStart();
});
