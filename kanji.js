var slideSound = new Audio('slide.wav');
var boomSound = new Audio('boom.wav');
var time = 0;//(new Date()).getTime();
	
var joined = false, framed = false;
var walls, frame;

// функция за създаване на сцената
function createScene()
{
	// нагласяване на цвета и центрирането на текста с имената ви
	document.getElementsByTagName('h1')[0].style = 'color:white; text-align:center;';

	// създаване на рисувателното поле на цял екран
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	renderer.domElement.style = 'width:100%; height:100%; position:fixed; top:0; left:0; z-index:-1;';

	document.body.addEventListener('click',function(e){if (e.button) enframe(); else slide();});
	document.body.addEventListener('keypress',function(e){if (e.keyCode!=32) enframe(); else slide();});
	document.body.addEventListener('contextmenu',function(e){ e.preventDefault(); enframe(); return false});
	
	// създаване на сцена и камера
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 0.1, 1000 );

	// създаване на земята като плоска равнина
	var ground = new THREE.Mesh(
		new THREE.PlaneGeometry(13000,13000),
		new THREE.MeshPhongMaterial({color:'goldenrod'})
	);
	ground.position.set(0,-11,0);
	ground.rotation.set(-Math.PI/2,0,0);
	scene.add( ground );

	// прозрачи стени
	walls = new THREE.Mesh(
		new THREE.BoxGeometry(21,21,11),
		new THREE.MeshPhongMaterial({color:'white',shininess:220,opacity:0.45,transparent:true,side:THREE.DoubleSide})
	);
	walls.visible = framed;
	scene.add(walls);

	// тънък бял кант
	frame = new THREE.BoxHelper(walls);
	frame.material.color.set('white');
	frame.visible = framed;
	scene.add( frame );

	// създаване на четири светлини с различни цветове
	lights=[];
	var colors=['dodgerblue','hotpink','cyan','fuchsia'];
	for (var i=0; i<4; i++)
	{
		lights[i] = new THREE.PointLight(colors[i],1);
		scene.add(lights[i]);
	}
	
	// активиране на анимацията
	drawFrame();
}

function slide()
{
	time = t;
	joined = !joined;
	slideSound.play();
}

function enframe()
{
	framed = !framed;
	walls.visible = framed;
	frame.visible = framed;
}

// функция за анимиране на сцената
var t = 0; // време
var time = -1000;
var vib = 0;
function drawFrame()
{
	requestAnimationFrame( drawFrame );
	
	t++;
	
	var delta = t - time;
	if (delta<=60)
	{
		if (!joined && delta==57) {boomSound.play(); vib=0.5;}
		delta = (delta/60-0.5)*Math.PI;
		part1.position.x = 2+(joined?1:-1)*2*Math.sin(delta);
		part2.position.x = -part1.position.x;
	}
	
	// леко въртене на сцената
	scene.rotation.x = Math.sin(t/135)/10;
	scene.rotation.y = Math.sin(t/200)/2;
	scene.rotation.z = Math.cos(t/111)/10;

	// приближаване и отдалечаване на камерата
	camera.position.set(0,3+Math.sin(t)*vib,60+10*Math.sin(t/250));
	camera.lookAt(new THREE.Vector3(0,Math.sin(t)*vib,0));
	vib = vib*0.95;

	// движение на светлините
	for (var i=0; i<4; i++)
	{
		var angle = t/100+Math.PI/2*i;
		lights[i].position.set(
			25*Math.cos(angle),
			10*Math.sin(1.5*angle)+5,
			15+5*Math.cos(2*angle));
	}
	
	//рисуване на сцената
	renderer.render( scene, camera );
}		

var part1 = new THREE.Object3D();
var part2 = new THREE.Object3D();

function main()
{
	createScene();

	scene.add(part1);
	scene.add(part2);
}