/* AI neural-network 3D hero background — Usman Kalera portfolio (v48)
   Three.js particle network: floating nodes + connecting lines,
   slow rotation, gentle mouse parallax. Theme-aware (dark/light),
   pauses off-screen, respects prefers-reduced-motion. */
(function () {
  var canvas = document.getElementById('ai-bg');
  if (!canvas || !window.THREE) return;
  var hero = canvas.parentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 62;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  var group = new THREE.Group();
  scene.add(group);

  var BW = 132, BH = 76, BD = 48;              // node field bounds
  var COUNT = window.innerWidth < 640 ? 55 : 110;
  var LINK = 27;                               // connection distance

  var positions = new Float32Array(COUNT * 3);
  var vel = [];
  for (var i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * BW;
    positions[i * 3 + 1] = (Math.random() - 0.5) * BH;
    positions[i * 3 + 2] = (Math.random() - 0.5) * BD;
    vel.push({
      x: (Math.random() - 0.5) * 0.05,
      y: (Math.random() - 0.5) * 0.05,
      z: (Math.random() - 0.5) * 0.03
    });
  }
  var nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  // soft round sprite so nodes render as glowing dots, not squares
  var sc = document.createElement('canvas'); sc.width = sc.height = 64;
  var g2 = sc.getContext('2d');
  var grad = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.9)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g2.fillStyle = grad; g2.fillRect(0, 0, 64, 64);
  var sprite = new THREE.CanvasTexture(sc);
  var nodeMat = new THREE.PointsMaterial({
    size: 2.4, map: sprite, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
  });
  group.add(new THREE.Points(nodeGeo, nodeMat));

  var maxLinks = COUNT * (COUNT - 1) / 2;
  var linePos = new Float32Array(maxLinks * 6);
  var lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  var lineMat = new THREE.LineBasicMaterial({
    transparent: true, opacity: 0.16,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  var lines = new THREE.LineSegments(lineGeo, lineMat);
  lines.frustumCulled = false;
  group.add(lines);

  function applyTheme() {
    var light = document.documentElement.getAttribute('data-theme') === 'light';
    if (light) {
      nodeMat.color.setHex(0xc77f0e); nodeMat.opacity = 0.75;
      lineMat.color.setHex(0xc77f0e); lineMat.opacity = 0.10;
      canvas.style.opacity = '0.6';
    } else {
      nodeMat.color.setHex(0xf5a623); nodeMat.opacity = 0.9;
      lineMat.color.setHex(0xffcf6b); lineMat.opacity = 0.16;
      canvas.style.opacity = '1';
    }
  }
  applyTheme();
  new MutationObserver(applyTheme).observe(document.documentElement,
    { attributes: true, attributeFilter: ['data-theme'] });

  var mx = 0, my = 0, tx = 0, ty = 0;
  hero.addEventListener('mousemove', function (e) {
    var r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 0.35;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 0.25;
  });
  hero.addEventListener('mouseleave', function () { tx = 0; ty = 0; });

  function resize() {
    var w = hero.clientWidth, h = hero.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  var running = true, visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; },
      { threshold: 0.02 }).observe(hero);
  }
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
  });

  function step() {
    for (var i = 0; i < COUNT; i++) {
      var ix = i * 3, iy = ix + 1, iz = ix + 2;
      positions[ix] += vel[i].x; positions[iy] += vel[i].y; positions[iz] += vel[i].z;
      if (positions[ix] > BW / 2 || positions[ix] < -BW / 2) vel[i].x *= -1;
      if (positions[iy] > BH / 2 || positions[iy] < -BH / 2) vel[i].y *= -1;
      if (positions[iz] > BD / 2 || positions[iz] < -BD / 2) vel[i].z *= -1;
    }
    nodeGeo.attributes.position.needsUpdate = true;
    var n = 0;
    for (var a = 0; a < COUNT; a++) {
      for (var b = a + 1; b < COUNT; b++) {
        var dx = positions[a * 3] - positions[b * 3];
        var dy = positions[a * 3 + 1] - positions[b * 3 + 1];
        var dz = positions[a * 3 + 2] - positions[b * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < LINK * LINK) {
          linePos[n++] = positions[a * 3]; linePos[n++] = positions[a * 3 + 1]; linePos[n++] = positions[a * 3 + 2];
          linePos[n++] = positions[b * 3]; linePos[n++] = positions[b * 3 + 1]; linePos[n++] = positions[b * 3 + 2];
        }
      }
    }
    lineGeo.setDrawRange(0, n / 3);
    lineGeo.attributes.position.needsUpdate = true;
    mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
    group.rotation.y = mx + performance.now() * 0.000018;
    group.rotation.x = my;
  }

  function frame() {
    requestAnimationFrame(frame);
    if (!running || !visible) return;
    step();
    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    step();
    renderer.render(scene, camera);   // one static frame, no animation
  } else {
    frame();
  }
})();
