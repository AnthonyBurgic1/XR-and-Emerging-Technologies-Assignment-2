const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = async function () {
    const scene = new BABYLON.Scene(engine);

    // Camera
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 2.5,
        5,
        BABYLON.Vector3.Zero(),
        scene
    );
    camera.attachControl(canvas, true);

    // Light
    new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    scene.createDefaultEnvironment();

    let model;

    try {
        const result = await BABYLON.SceneLoader.ImportMeshAsync(
            "",
            "./models/",
            "walking_tank_copy.glb",
            scene
        );

        model = result.meshes[0];

        model.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
        model.position = new BABYLON.Vector3(0, 1, 2);

        console.log("Model Loaded!");
    } catch (err) {
        console.error("Model failed to load:", err);
    }

    // Rotate model safely
    scene.registerBeforeRender(() => {
        if (model) {
            model.rotation.y += 0.01;
        }
    });

    // XR (SAFE VERSION — won’t crash if unsupported)
    if (navigator.xr) {
        try {
            await scene.createDefaultXRExperienceAsync({
                uiOptions: { sessionMode: "immersive-vr" }
            });
            console.log("XR Ready");
        } catch (err) {
            console.log("XR not available on this device.");
        }
    }

    return scene;
};

createScene().then((scene) => {
    engine.runRenderLoop(() => {
        scene.render();
    });
});

window.addEventListener("resize", () => {
    engine.resize();
});