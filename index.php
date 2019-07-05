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
  <?php 
      $arr = ['run' => 'Run', 'download' => 'Download', 'upload' => 'Upload'];
      foreach ($arr as $id => $display) {
        echo "<button id=$id class='display-button'>$display</button>"; 
      };
    ?>
  <br />
  <div>
    <?php 
      // 'matrix' => 'Matrix', 'options' => 'Options', 
      $arr = ['source' => 'Source', 'result' => 'Result'];
      foreach ($arr as $id => $display) {
        echo "<button id=$id class='tab-button display-button'>$display</button>"; 
      };
    ?>
  </div>
  <div id='result-dash'>
    <?php 
      $arr = ['objective' => 'Objective', 'constraints' => 'Constraints', 'sensitivity' => 'Sensitivity'];
      foreach ($arr as $id => $display) {
        echo "<button id=$id class='result-tab display-button'>$display</button>"; 
      };
      echo "<button id='download-report' class='display-button'>Download Report</button>"
    ?>
  </div>
  <textarea id='textspace' class='text-display'></textarea>
  <b>Log</b>
  <textarea id='log' class='text-display' readonly></textarea>
</body>

</html>