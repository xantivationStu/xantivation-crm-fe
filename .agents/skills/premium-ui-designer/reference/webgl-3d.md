# WebGL & 3D Performance Guidelines (webgl-3d.md)

This document regulates technical standards and optimization patterns for integrating WebGL, Three.js, and React Three Fiber (R3F) scenes into premium Awwwards-level interfaces.

---

## 1. WebGL Memory Management (Dọn dẹp rác bộ nhớ)

WebGL memory is not garbage-collected automatically by the JavaScript engine. To prevent browser tab crashes (especially on mobile):

*   **Disposal of Geometries and Materials:** Whenever a 3D component unmounts, you must traverse the scene and explicitly dispose of all geometries, materials, and textures.
*   **Disposal helper blueprint (Vanilla Three.js):**
    ```javascript
    function disposeScene(scene) {
      scene.traverse((object) => {
        if (!object.isMesh) return;
        
        // Dispose geometry
        if (object.geometry) object.geometry.dispose();
        
        // Dispose materials (handle arrays and multi-materials)
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
    ```
*   **React Three Fiber (R3F) Auto-disposal:** R3F handles auto-disposal for elements declared directly inside JSX. However, if you load external assets (like GLTF models) using `useLoader` or reference textures inside variables/hooks outside the render tree, you **must** dispose of them manually inside a `useEffect` cleanup return.

---

## 2. Device Tiering & FPS Optimization (Tối ưu hóa thiết bị)

To maintain a consistent 60 FPS performance on all platforms:

1.  **Strict Pixel Ratio Ceiling:** Never set `renderer.setPixelRatio(window.devicePixelRatio)`. On high-density Retina/mobile screens, this forces the GPU to render at 3x resolution, causing massive lag. Always clamp pixel ratio to a maximum of **`2.0`**:
    ```tsx
    <Canvas dpr={[1, 2]}> {/* Clamps pixel ratio between 1.0 and 2.0 */}
    ```
2.  **Shadow Map Budgets:**
    *   *High-tier (Desktop):* Shadow map resolution max `2048x2048`.
    *   *Mid/Low-tier (Mobile):* Disable shadow maps entirely, or limit to `512x512` with simple soft shadows.
3.  **Adaptive Post-Processing:** Avoid stacking heavy shaders (Bloom, Depth of Field, SSAO, Glitch) on mobile viewports. Check the client's device tier and automatically switch off postprocessing passes if mobile is detected:
    ```tsx
    import { EffectComposer, Bloom } from '@react-three/postprocessing';
    
    export function AdaptiveScene({ isMobile }) {
      return (
        <Canvas>
          {/* Only render post-processing effects on desktop */}
          {!isMobile && (
            <EffectComposer>
              <Bloom intensity={0.5} luminanceThreshold={0.9} />
            </EffectComposer>
          )}
        </Canvas>
      );
    }
    ```

---

## 3. Responsive Camera Aspect Ratio (Điều chỉnh Camera động)

Standard horizontal perspective cameras crop the sides of 3D objects on narrow vertical viewports (Mobile). To prevent meshes from being clipped:

*   **Dynamic FOV Adjustment:** Calculate the Field of View (FOV) based on screen width/height ratio.
*   **R3F Responsive Camera Blueprint:**
    ```tsx
    import { useFrame, useThree } from '@react-three/fiber';
    
    function ResponsiveCamera() {
      const { camera, size } = useThree();
      
      useFrame(() => {
        const aspect = size.width / size.height;
        if (aspect < 1) {
          // Vertical screen (mobile): increase FOV to pull camera back
          camera.fov = 60 / aspect;
        } else {
          // Horizontal screen (desktop): keep standard FOV
          camera.fov = 50;
        }
        camera.updateProjectionMatrix();
      });
      
      return null;
    }
    ```

---

## 4. UI Layer Integration & z-index (Phân tầng z-index)

WebGL Canvas elements must integrate smoothly behind or between HTML layouts without blocking click actions:

*   **Pointer Events Isolation:** The wrapping container of the Canvas must use CSS `pointer-events: none` so users can scroll and click on standard HTML text, links, and buttons sitting above it.
*   **Interactive 3D Meshes:** If specific 3D meshes in the Canvas are clickable, toggle pointer events back to auto inside the canvas wrapper, or use R3F's built-in raycasting handlers (`onClick`, `onPointerOver`).
*   **CSS Blueprint:**
    ```css
    .canvas-container {
      position: fixed;
      inset: 0;
      z-index: 0; /* Behind content */
      pointer-events: none; /* Let clicks pass through to HTML text */
    }
    
    .canvas-interactive {
      pointer-events: auto; /* Re-enable clicks for R3F interactive objects */
    }
    ```
