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
  <h1>lp_solve_online v0.3</h1>
  <p>This web app is inspired by the lp_solve5.5.2.5 IDE.</p>
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
        'objective-button' => 'Objective', 
        'constraints-button' => 'Constraints', 
        'sensitivity-button' => 'Sensitivity'];
      foreach ($arr as $id => $display) {
        echo "<button id=$id class='result-tab display-button'>$display</button>"; 
      };
      echo "<button id='download-report' class='display-button'>Download Report</button>"
    ?>
  </div>
  <div hidden id='matrix-config'>
    <div>
      <?php 
        $VAR = 1;
        $RESTRICT = 2;
        echo "<span>Variables</span><input type='number' min=1 
        value=$VAR id='variable-count' class='counter-mod'>";
        echo "<span>Constraints</span><input type='number' min=0 
        value=$RESTRICT id='constraint-count' class='counter-mod'>";
        echo '<button id="reset-button">Reset</button>';
        echo '<button id="parse-matrix">Parse Matrix</button>'
      ?>
    </div>
    <?php 
      echo '<table id="lp-matrix" border="1">
      <tbody id="matrix-body">';
      echo '<tr id="variable-names"><td>Variable Name(s)</td>';
      for ($i = 0; $i < $VAR; $i++) {
        echo '<td><input type="text" class="matrix-input"/></td>';
      }  
      echo '</tr>';
      echo '<tr id="objective-function"><td>Optimize</td>';
      for ($i = 0; $i < $VAR; $i++) {
        echo '<td><input type="number" class="matrix-input"/></td>';
      }
      echo '<td><select id="optimal-goal">
      <option> max </option>
      <option> min </option>
      <option> toValue </option>
      </select>
      <span id="target-goal-value" hidden><input type="text" /></span>
      </td>';
      echo '</tr>';
      
      for ($i = 0; $i < $RESTRICT; $i++) {
        echo '<tr class="constraint-equations">';
        echo '<td>Constraint</td>';
        for ($j = 0; $j < $VAR; $j++) {
          echo '<td><input type="number" class="matrix-input"/></td>';
        }        
        echo '<td><select>
          <option> ≤ </option>
          <option> ≥ </option>
          <option> = </option>
          <option> > </option>
          <option> < </option>
        </select></td>';
        echo '<td><input type="number" class="matrix-input"/></td>';
        echo '</tr>';
      }
      echo '</tbody>
      </table>'
      ?>
    </table>
  </div>
  <textarea id='textspace' class='text-display'></textarea>
  <!-- Matrix Input -->
  <b>Log</b>
  <textarea id='log' class='text-display' readonly></textarea>
</body>

</html>