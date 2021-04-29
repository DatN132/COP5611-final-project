<!DOCTYPE html>
<html lang="en" dir="ltr">
  <?php
        // Require https
    if (!(isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] == 'on'))) {
    $url = "https://". $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
    header("Location: $url");
    exit;
    }
  ?>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>CHIP-8 EMULATOR</title>
  </head>
  <body>
    <main>
        <div class="console" align="center">
          <h1>CHIP-8 EMULATOR</h1>
          <canvas id="screen"></canvas>
          <script type="module" src="./src/index.js"></script>
        </div>
    </main>

  </body>
</html>
