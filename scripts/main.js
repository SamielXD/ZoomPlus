const zoomSpeed = 0.3;
const minZoom = 0.05;
const maxZoom = 100;
const defaultMinZoom = 1.5;
const defaultMaxZoom = 6;

let zoomEnabled = true;
let savedZoom = 1;

function setZoom(value) {
  if (!zoomEnabled) return;
  value = Mathf.clamp(value, minZoom, maxZoom);
  Vars.renderer.minZoom = minZoom;
  Vars.renderer.maxZoom = maxZoom;
  Core.camera.position.set(Core.camera.position.x, Core.camera.position.y);
  
  let scale = value;
  Core.camera.width = Core.graphics.getWidth() / scale;
  Core.camera.height = Core.graphics.getHeight() / scale;
  Core.camera.update();
}

function getZoom() {
  return Core.graphics.getWidth() / Core.camera.width;
}

function toggleZoom(enabled) {
  zoomEnabled = enabled;
  
  if (enabled) {
    Vars.renderer.minZoom = minZoom;
    Vars.renderer.maxZoom = maxZoom;
    setZoom(savedZoom);
    Vars.ui.showInfoToast("[lime]✅ Infinite Zoom Enabled!", 2);
  } else {
    savedZoom = getZoom();
    Vars.renderer.minZoom = defaultMinZoom;
    Vars.renderer.maxZoom = defaultMaxZoom;
    let currentZoom = getZoom();
    if (currentZoom < defaultMinZoom || currentZoom > defaultMaxZoom) {
      Core.camera.width = Core.graphics.getWidth();
      Core.camera.height = Core.graphics.getHeight();
      Core.camera.update();
    }
    Vars.ui.showInfoToast("[scarlet]❌ Zoom Disabled - Reset to Default", 2);
  }
}

Events.run(ClientLoadEvent, () => {
  Vars.renderer.minZoom = minZoom;
  Vars.renderer.maxZoom = maxZoom;
  
  Vars.ui.settings.addCategory("Infinite Zoom", Icon.zoom, table => {
    table.checkPref("infinitezoom_enabled", true, val => {
      toggleZoom(val);
    });
    table.row();
    
    table.button("📊 Show Current Zoom", () => {
      let current = getZoom().toFixed(2);
      Vars.ui.showInfoToast("[accent]Current Zoom: " + current + "x", 2.5);
    }).size(220, 55).padTop(15);
    table.row();
    
    table.add("[gray]Range: " + minZoom + "x - " + maxZoom + "x").padTop(10);
  });
  
  print("[Infinite Zoom] Loaded! Range: " + minZoom + "x to " + maxZoom + "x");
});
