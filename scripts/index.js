const dev = true
const LP_SOLVE_API = dev ? "http://localhost:5000/" : "https://peaceful-zion-91234.herokuapp.com/"


$(document).ready(() => {
  const SYS = {
    TEXTSPACE: '#textspace',
    SOURCE: '#source',
    MATRIX: '#matrix',
    OPTIONS: '#options',
    RESULT: '#result',
    RESULT_DASH: '#result-dash',
    OBJECTIVE: '#objective',
    CONSTRAINTS: '#constraints',
    SENSITIVITY: '#sensitivity',
    DOWNLOAD_REPORT: '#download-report',
    DOWNLOAD: '#download',
    LOG: '#log',
    UPLOAD: '#upload',
    RUN: '#run',
    class: {
      RESULT_TAB: '.result-tab',
      TAB_BUTTON: '.tab-button'
    }
  }
  let state = {
    current: SYS.SOURCE
  }

  function updateLog(content) {
    $(SYS.LOG).val(`${$(SYS.LOG).val()}${content}\n`)
  }

  function displayTextIn(element) {
    $(SYS.TEXTSPACE).val($(element).val())
  }

  function storeTextIn(element) {
    $(element).val($(SYS.TEXTSPACE).val())
  }

  function setNextStateAs(element) {
    state.current = element
  }

  function valueOf(element) {
    return $(element).val()
  }

  function pressedButtonID(e) {
    const clicked_button = $(e.target)
    return `#${clicked_button[0].id}`
  }

  $(SYS.UPLOAD).click(() => {
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
        $(SYS.SOURCE).val(content)
        if (state.current === SYS.SOURCE) {
          $(SYS.TEXTSPACE).val(content)
        }
        updateLog(`Content from ${filename} is placed into source text space.\n`)
        document.body.removeChild(input)
      }
    }
    input.click();
  })


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

  $(SYS.DOWNLOAD_REPORT).click(() => {
    var report = {
      'objective.txt': valueOf(SYS.OBJECTIVE),
      'sensitivity.txt': valueOf(SYS.SENSITIVITY),
      'constraints.txt': valueOf(SYS.CONSTRAINTS)
    }
    downloadForUser(report)
  })

  $(SYS.DOWNLOAD).click(() => {
    if (state.current === SYS.SOURCE) {
      storeTextIn(SYS.SOURCE)
    }
    downloadForUser({
      'lp_solve.txt': valueOf(SYS.SOURCE)
    })
  })

  $(SYS.RUN).click(() => {
    // If currently on source, first save all current progress.
    if (state.current === SYS.SOURCE) {
      storeTextIn(SYS.SOURCE)
    }

    var request_data = {
      content: $(SYS.SOURCE).val()
    }

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
      if (res.error === '') {
        updateLog('Running Complete.\n')
      } else {
        updateLog(res.error)
      }

      var sections = res.report
      var mapping = {
        'Actual values of the constraints': SYS.CONSTRAINTS,
        'Model name': SYS.OBJECTIVE,
        'Objective function limits': SYS.SENSITIVITY,
      }
      for (var section in sections) {
        var tab = mapping[section]
        $(tab).val(sections[section])
      }
      displayTextIn(state.current)
    }).catch(function (e) {
      console.log(e)
      console.log('Error')
    })
  })

  /**
   * Changes the content of the text area into the values associated to the button clicked.
   */
  $(SYS.class.TAB_BUTTON).click((e) => {
    storeTextIn(state.current)

    setNextStateAs(pressedButtonID(e))
    if (state.current === SYS.RESULT) {
      $(SYS.RESULT_DASH).show()
      setNextStateAs(SYS.OBJECTIVE)
    } else {
      $(SYS.RESULT_DASH).hide()
    }
    displayTextIn(state.current)

    $(SYS.TEXTSPACE).attr('readonly', state.current !== SYS.SOURCE)
    console.log('Assertion', state.current !== SYS.RESULT)
  })

  $(SYS.class.RESULT_TAB).click(e => {
    var next_tab = pressedButtonID(e)
    storeTextIn(state.current)
    setNextStateAs(next_tab)
    displayTextIn(state.current)
  })
})
