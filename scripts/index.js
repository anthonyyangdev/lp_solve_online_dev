
// Sets whether the project is in development or in production
const dev = false
const LP_SOLVE_API = dev ? "http://localhost:5000/" : "https://peaceful-zion-91234.herokuapp.com/"

$(document).ready(() => {
  /**
   * Constants in the website. HTML/CSS ids are stored as key => value mappings.
   * HTML/CSS class names are stored in the {@var SYS.class} property.
   */
  const SYS = {
    main: {
      SOURCE: '#source',
      MATRIX: '#matrix',
      OPTIONS: '#options',
      RESULT: '#result',
      DOWNLOAD: '#download',
      UPLOAD: '#upload',
      RUN: '#run',
      TEXTSPACE: '#textspace',
      LOG: '#log',
      HELP: '#help'
    },
    matrix: {
      MATRIX_CONFIG: '#matrix-config',
      LP_MATRIX: '#lp-matrix',
      VAR_COUNT: '#variable-count',
      CONSTRAINT_COUNT: '#constraint-count',
      MATRIX_BODY: '#matrix-body',
      RESET: '#reset-button',
      OPTIMAL_GOAL: '#optimal-goal',
      TARGET_GOAL_VALUE: '#target-goal-value',
      PARSE_MATRIX: '#parse-matrix',
      VARIABLE_NAMES: '#variable-names',
      OBJECTIVE_FUNCTION: '#objective-function',
    },
    result: {
      RESULT_DASH: '#result-dash',
      DOWNLOAD_REPORT: '#download-report',
      OBJECTIVE: '#objective-button',
      CONSTRAINTS: '#constraints-button',
      SENSITIVITY: '#sensitivity-button',
    },
    class: {
      RESULT_TABS: '.result-tab',
      TAB_BUTTONS: '.tab-button',
      CONSTRAINT_EQ: '.constraint-equations',
      COUNTER_MOD: '.counter-mod',
      MATRIX_INPUT: '.matrix-input'
    }
  }
  const EQUALITY_OPTIONS = '<td><select><option> <= </option><option> >= </option><option> = </option><option> > </option><option> < </option></select></td><td><input type="number"/></td>'


  /**
   * Records the current state of the website
   */
  let state = {
    current: SYS.main.SOURCE,
    'constraint-count': parseInt($(SYS.matrix.CONSTRAINT_COUNT).val()),
    'variable-count': parseInt($(SYS.matrix.VAR_COUNT).val())
  }

  /**
   * Updates the log with a new message. This message is to displayed following
   * all of the previous log messages.
   * @param {string} content The output to be displayed in the log.
   */
  function updateLog(content) {
    $(SYS.main.LOG).val(`${$(SYS.main.LOG).val()}${content}\n`)
  }

  /**
   * Displays the text given an HTML/CSS id value onto the website textspace
   * box.
   * @param {string} element The id value of an HTML/CSS element.
   */
  function displayTextIn(element) {
    $(SYS.main.TEXTSPACE).val($(element).val())
  }

  /**
   * Stores the content in the website textspace in the hidden value of an
   * HTML/CSS element.
   * @param {string} element The id value of an HTML/CSS element.
   */
  function storeTextIn(element) {
    $(element).val($(SYS.main.TEXTSPACE).val())
  }

  /**
   * Changes the state of the website to the value of the next HTML/CSS 
   * element id.
   * @param {string} element The id value of an HTML/CSS element.
   */
  function setNextStateAs(element) {
    state.current = element
  }

  /**
   * Returns the value stored in an HTML/CSS id.
   * @param {string} element The id value of an HTML/CSS element.
   */
  function valueOf(element) {
    return $(element).val()
  }

  /**
   * True if the current state is equal to an HTML/CSS element's id value. 
   * False otherwise.
   * @param {string} element The id value of an HTML/CSS element.
   */
  function currentStateIs(element) {
    return element === state.current
  }

  /**
   * Returns the id value of a pressed button event.
   * @param {Event} e 
   */
  function pressedButtonID(e) {
    const clicked_button = $(e.target)
    return `#${clicked_button[0].id}`
  }

  /**
   * When the upload button is clicked, users are prompted to select a file
   * in their file systems. If a file is selected, then the contents of that
   * file is displayed onto the website's text space.
   * 
   * The selected file must be a *.lp or a *.txt file. For any other files,
   * the operation is cancelled.
   */
  $(SYS.main.UPLOAD).click(() => {
    var input = document.createElement('input');
    input.type = 'file';
    document.body.appendChild(input)
    input.onchange = e => {
      var file = e.target.files[0]
      var filename = file.name
      var reader = new FileReader()
      reader.readAsText(file, 'UTF-8')
      reader.onload = readerEvent => {
        var content = readerEvent.target.result
        $(SYS.main.SOURCE).val(content)
        if (state.current === SYS.main.SOURCE) {
          $(SYS.main.TEXTSPACE).val(content)
        }
        updateLog(`Content from ${filename} is placed into source text space.\n`)
      }
      document.body.removeChild(input)
    }
    input.click();
  })

  /**
   * The values in {@var contents} are turned into files, where the filenames
   * for each are their key values. These files are then downloaded into the 
   * user's file systems.
   * @param {Map<String, String>} contents 
   */
  function downloadForUser(contents) {
    var a = document.createElement('a')
    for (var name in contents) {
      var file = new Blob([contents[name]], { type: 'text/plain' })
      a.href = URL.createObjectURL(file)
      a.download = name
      document.body.appendChild(a)
      a.click()
      updateLog(`${name} Downloaded...\n`)
    }
    setTimeout(function () {
      document.body.removeChild(a)
    }, 0)
  }

  /**
   * Download the report of a lp_solve calculation as one file named report.txt.
   */
  $(SYS.result.DOWNLOAD_REPORT).click(() => {
    downloadForUser({ 'report.txt': valueOf(SYS.result.DOWNLOAD_REPORT) })
  })

  /**
   * Download the contents of the source text space as a file named lp_solve.txt
   */
  $(SYS.main.DOWNLOAD).click(() => {
    if (currentStateIs(SYS.main.SOURCE)) {
      storeTextIn(SYS.main.SOURCE)
    }
    downloadForUser({ 'lp_solve.txt': valueOf(SYS.main.SOURCE) })
  })


  $(SYS.main.HELP).click(() => {
    //    const msg = 'This web app is still in its TESTING stages and currently only receiving MINIMAL amounts of support.\nHowever, MOST LP problems can be solved, where the results/answers are displayed in the [Results] section (Press the [Result] button to see.)\nIt is though HIGHLY recommended that you check with the actual lp_solve program or a spreadsheet model.'
    const msg = 'Help:\n\nClick on the [Source] button and write your algebraic model in the text space below.\nThe syntax follows the same convention as that for the original lp_solve program.\n\nWhen done, press the [Run] button for the model to be solved. The bottom of the screen will display [Running Complete.] if successful.\n\nThe results/answers are displayed in the [Results] section (Press the [Result] button to see.)\n\nSince this is currently being built and tested, it is recommended that you check with the actual lp_solve program or a spreadsheet model to decide on the optimal solution.'
    alert(msg)
  })

  function buildConstraintRowHTML() {
    let row = document.createElement('tr')
    let html = '<td>Constraint</td>'
    for (var i = 0; i < state['variable-count']; i++) {
      html += '<td><input type="number" class="matrix-input"></td>'
    }
    row.innerHTML = html + EQUALITY_OPTIONS
    return row
  }


  $(SYS.class.COUNTER_MOD).change(function (e) {
    const value = $(this).val()
    const id = $(this)[0].id

    var lowLimit = `#${id}` === SYS.matrix.CONSTRAINT_COUNT ? 0 : 1
    if (value < lowLimit) { return }

    const diff = value - state[id]
    state[id] = parseInt(value)

    operation = {
      'incr-variable-count': () => {
        children = $(SYS.matrix.MATRIX_BODY)[0].children
        for (var child of children) {
          const node = document.createElement('td')
          node.innerHTML = '<input type="text" class="matrix-input"/>'
          $(child)[0].insertBefore(node, $(child)[0].childNodes[1])
        }
      },
      'decr-variable-count': () => {
        children = $(SYS.matrix.MATRIX_BODY)[0].children
        for (var child of children) {
          const firstVarChild = $(child)[0].childNodes[1]
          $(child)[0].removeChild(firstVarChild)
        }
      },
      'incr-constraint-count': () => {
        const row = buildConstraintRowHTML()
        $(SYS.matrix.MATRIX_BODY)[0].appendChild(row)
      },
      'decr-constraint-count': () => {
        const lastChild = $(SYS.matrix.MATRIX_BODY)[0].lastChild
        $(SYS.matrix.MATRIX_BODY)[0].removeChild(lastChild)
      }
    }
    performOperation = diff > 0 ? operation[`incr-${id}`] : operation[`decr-${id}`]
    for (var i = 0; i < Math.abs(diff); i++)
      performOperation()
  })

  $(SYS.matrix.RESET).click(function () {
    $(SYS.class.MATRIX_INPUT).val('')
  })

  $(SYS.matrix.OPTIMAL_GOAL).change(() => {
    if ($(SYS.matrix.OPTIMAL_GOAL).val() === 'toValue') {
      $(SYS.matrix.TARGET_GOAL_VALUE).show()
    } else {
      $(SYS.matrix.TARGET_GOAL_VALUE).hide()
    }
  })


  $(SYS.matrix.PARSE_MATRIX).click(function () {
    var variables = $(SYS.matrix.VARIABLE_NAMES)[0].children
    var objective = $(SYS.matrix.OBJECTIVE_FUNCTION)[0].children
    var constraints = $(SYS.matrix.MATRIX_BODY)[0].children

    var program = { objective: '', constraints: [] }

    for (var i = 1; i < variables.length; i++) {
      var coefficient = $(objective[i]).children().first().val()
      var name = $(variables[i]).children().first().val()

      if (name == '') {
        alert(`A name is not given for variable ${i}`)
        return
      }
      if (coefficient == '') { coefficient = 0; }

      program.objective += `${coefficient}${name}`
      program.objective += (i === variables.length - 1) ? ';' : '+'
    }

    for (var i = 1; i < variables.length + 2; i++) {
      var name = i < variables.length ? $(variables[i]).children().first().val() : ''

      for (var j = 2; j < state['constraint-count'] + 2; j++) {
        let R = $($(constraints[j]).children()[i]).children().first().val()
        if (R == '') { R = 0 }
        program.constraints[j - 2] = i === 1 ? '' : program.constraints[j - 2]
        program.constraints[j - 2] += `${R}${name}`
        program.constraints[j - 2] += i < variables.length - 1 ? '+' : (i < variables.length + 1 ? '' : ';')
      }
    }
    program.objective = `${$(SYS.matrix.OPTIMAL_GOAL).val()}: ${program.objective}`
    $(SYS.main.SOURCE).val(program.objective)
    for (var constraint of program.constraints) {
      const prev = $(SYS.main.SOURCE).val()
      $(SYS.main.SOURCE).val(`${prev}\n${constraint}`)
    }
    alert('Your matrix has been parsed into algebraic statements in `SOURCE`')
  })

  /**
   * Connects to the lp_solve_server, which performs the linear programming
   * calculations, and receives the results from those calculations.
   * 
   * If there are no errors, then the log will message the user that the
   * running is complete.
   * Otherwise, the log message will display the error message preformed by 
   * lp_solve.
   * 
   * If the website is unable to connect to the server, then log that the server
   * could not be connected.
   * 
   * {@var response = {
   *    report: [Object]
   *    error: [String]
   *    lp_solve_error: [String]
   * }}
   * 
   */
  $(SYS.main.RUN).click(() => {
    // If currently on source, first save all current progress.
    if (currentStateIs(SYS.main.SOURCE)) {
      storeTextIn(SYS.main.SOURCE)
    }

    var request_data = { content: valueOf(SYS.main.SOURCE) }

    updateLog('Now Running...')

    fetch(LP_SOLVE_API, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(request_data), // body data type must match "Content-Type" header
    }).then(response => {
      return response.json()
    }).then(res => {
      console.log(res)
      const SOLUTION = res.result.solution
      updateLog('Running Complete.\n')
      $(SYS.result.DOWNLOAD_REPORT).val(res.result.solution)
      $(SYS.result.OBJECTIVE).val(SOLUTION)
      displayTextIn(state.current)
      // if (res.error === '') {
      //   updateLog('Running Complete.\n')
      // } else {
      //   updateLog(res.lp_solve_error)
      //   return
      // }

      // var sections = res.report
      // var mapping = {
      //   'Actual values of the constraints': SYS.CONSTRAINTS,
      //   'Model name': SYS.OBJECTIVE,
      //   'Objective function limits': SYS.SENSITIVITY,
      // }
      // for (var section in sections) {
      //   var tab = mapping[section]
      //   $(tab).val(sections[section])
      // }
      // $(SYS.DOWNLOAD_REPORT).val(res.result)
      // displayTextIn(state.current)
    }).catch(function (_) {
      updateLog('Unable to connect to the server...')
    })
  })

  function setMatrixState(status) {
    var _ = status ? $(SYS.matrix.MATRIX_CONFIG).show() : $(SYS.matrix.MATRIX_CONFIG).hide()
    var _ = status ? $(SYS.main.TEXTSPACE).hide() : $(SYS.main.TEXTSPACE).show()
  }

  /**
   * Changes the content of the text area into the values associated to the 
   * button clicked.
   */
  $(SYS.class.TAB_BUTTONS).click((e) => {
    storeTextIn(state.current)

    setNextStateAs(pressedButtonID(e))
    if (currentStateIs(SYS.main.RESULT)) {
      $(SYS.result.RESULT_DASH).show()
      setNextStateAs(SYS.result.OBJECTIVE)
    } else {
      $(SYS.result.RESULT_DASH).hide()
    }


    if (currentStateIs(SYS.main.MATRIX)) {
      setMatrixState(true)
      return
    } else {
      setMatrixState(false)
    }
    displayTextIn(state.current)

    $(SYS.main.TEXTSPACE).attr('readonly', !currentStateIs(SYS.main.SOURCE))
    console.log('Assertion', !currentStateIs(SYS.main.RESULT))
  })

  /**
   * Changes the content of the text area into the values associated to the 
   * button clicked.
   */
  $(SYS.class.RESULT_TABS).click(e => {
    var next_tab = pressedButtonID(e)
    storeTextIn(state.current)
    setNextStateAs(next_tab)
    displayTextIn(state.current)
  })
})
