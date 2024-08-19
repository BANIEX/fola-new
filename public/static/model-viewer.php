<?php
function minify_output($buffer)
{
  $search = array('/\>[^\S ]+/s', '/[^\S ]+\</s', '/(\s)+/s');
  $replace = array('>', '<', '\\1');
  if (preg_match("/\<html/i", $buffer) == 1 && preg_match("/\<\/html\>/i", $buffer) == 1) {
    $buffer = preg_replace($search, $replace, $buffer);
  }
  return $buffer;
}
?>
<html>

<body>
  <model-viewer shadow-intensity="1" style="width: 100vw; height: 100vh" id="shoe" camera-controls touch-action="pan-y" src="<?php echo isset($_GET['model-uri']) ? $_GET['model-uri'] : 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb'; ?>" tone-mapping="commerce" ar alt="A 3D model of a Shoe">
    <div class="controls" style="padding: 1rem">
      <div>Material: <select id="variant"></select></div>
    </div>
  </model-viewer>
  <script>
    const modelViewerVariants = document.querySelector("model-viewer#shoe");


    // Function to send message to the parent frame
    function sendMessageToParent() {
      var message = 'Hello from child!';
      window.parent.postMessage(message, 'http://localhost:3000'); // Change URL to your parent frame's domain
    }

    // Event listener to receive messages from the parent frame
    window.addEventListener('message', function(event) {
      if (event.origin !== 'http://localhost:3000') return; // Restrict messages to a specific origin
        switch(event.data.type) {
          case "base-color":
            console.log('Message received from parent:', event.data);
            const [material] = modelViewerColor.model.materials;
            material.pbrMetallicRoughness.setBaseColorFactor(event.data.value);
            break;
        }
    });

    const select = document.querySelector('#variant');

    modelViewerVariants.addEventListener('load', () => {
      const names = modelViewerVariants.availableVariants;
      for (const name of names) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      }
      // Adds a default option.
      const option = document.createElement('option');
      option.value = 'default';
      option.textContent = 'Default';
      select.appendChild(option);
    });

    select.addEventListener('input', (event) => {
      modelViewerVariants.variantName = event.target.value === 'default' ? null : event.target.value;
    });
  </script>
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    model-viewer {
      background-color: #FAFAFA;
    }
  </style>
</body>

</html>