import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Let's create an html file that outputs the data URL in DOM
const html = `<!DOCTYPE html>
<html>
<body>
  <canvas id="c"></canvas>
  <div id="output"></div>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'file:///c:/Users/Cheikh khady/OneDrive/Documents/PROJET/HT/1787528591787.png';
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // Clean top-left logo
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(20, 50, 430, 280);

      // Clean center watermark
      ctx.fillRect(140, 360, 600, 500);

      // Put base64 in dom
      const data = canvas.toDataURL('image/png').replace(/^data:image\\/png;base64,/, '');
      document.getElementById('output').innerText = data;
    };
  </script>
</body>
</html>`;

writeFileSync('c:/Users/Cheikh khady/OneDrive/Documents/PROJET/HT/temp_convert.html', html);
console.log('HTML written');
