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
      $arr = ['run' => 'Run', 'download' => 'Download', 'upload' => 'Upload', 'help' => 'Help'];
      foreach ($arr as $id => $display) {
        echo "<button id=$id class='display-button'>$display</button>"; 
      };
    ?>
  <br />
  <div>
    <?php 
      // 'matrix' => 'Matrix', 'options' => 'Options', 
      $arr = ['source' => 'Source', 'matrix' => 'Matrix', 'result' => 'Result'];
      foreach ($arr as $id => $display) {
        echo "<button id=$id class='tab-button display-button'>$display</button>"; 
      };
    ?>
  </div>
  <div id='result-dash'>
    <?php 
      $arr = [
        'objective' => 'Objective', 
        'constraints' => 'Constraints', 
        'sensitivity' => 'Sensitivity'];
      foreach ($arr as $id => $display) {
        echo "<button id=$id class='result-tab display-button'>$display</button>"; 
      };
      echo "<button id='download-report' class='display-button'>Download Report</button>"
    ?>
  </div>
  <div>
    <div>
      <?php 
        $VAR = 10;
        $RESTRICT = 0;
        echo "<span>Variables</span><input type='number' min=1 value=$VAR> ";
        echo "<span>Constraints</span><input type='number' min=0 value=$RESTRICT>";
        echo "<button>Reset</button>";
      ?>
    </div>
    <?php 
      echo '<table id="lp-matrix" border="1"><tbody>';
      echo '<tr><td>Variable Name(s)</td>';
      for ($i = 0; $i < $VAR; $i++) {
        echo '<td><input type="text"/></td>';
      }  
      echo '</tr>';
      for ($i = 0; $i < $RESTRICT + 1; $i++) {
        echo '<tr>';
        for ($j = 0; $j < $VAR + 1; $j++) {
          if ($j === 0 && $i === 0) {
            echo '<td>Optimize</td>';
          } else if ($j === 0) {
            echo '<td>Constraint</td>';      
          } else {
            echo '<td><input type="number"/></td>';
          }
        }
        
        if ($i === 0 && $j > $VAR - 2) {
          continue;
        }
        echo '<td><select>
          <option> ≤ </option>
          <option> ≥ </option>
          <option> = </option>
          <option> > </option>
          <option> < </option>
        </select></td>';
        echo '<td><input type="number"/></td>';
        echo '</tr>';
      }
      echo '</tbody></table>'
      ?>
    </table>
  </div>
  <textarea id='textspace' class='text-display'></textarea>
  <!-- Matrix Input -->
  <b>Log</b>
  <textarea id='log' class='text-display' readonly></textarea>
</body>

</html>