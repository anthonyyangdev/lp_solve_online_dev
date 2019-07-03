<!DOCTYPE html>
<html>

<head>
  <link rel="stylesheet" href='./styles/style.css'>
  <link rel="stylesheet" href="lib/codemirror.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src='./scripts/index.js'></script>
  <script src="lib/codemirror.js"></script>
  <script src="mode/javascript/javascript.js"></script>
</head>

<body>
  <h1>lp_solve 5.5.2.5 Online</h1>
  <button id='run' class='display-button'>Run</button><br />
  <div>
    <?php 
      $arr = ['source' => 'Source', 'matrix' => 'Matrix', 'options' => 'Options', 'result' => 'Result'];
      foreach ($arr as $id => $display) {
        echo "<button id=$id class='tab-button display-button'>$display</button>"; 
      };
    ?>
  </div>
  <div id='result-dash'>
    <?php 
      $arr = ['objective' => 'Objective', 'constraints' => 'Constraints', 'sensitivity' => 'Sensitivity'];
      foreach ($arr as $id => $display) {
        echo "<button id=$id class='result-tab'>$display</button>"; 
      };
    ?>
  </div>
  <textarea id='textspace'></textarea>
  <b>Log</b>
  <textarea id='log' readonly></textarea>
</body>

</html>