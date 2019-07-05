$(document).ready(() => {

  const SYS = {
    SOURCE: 'source',
    MATRIX: 'matrix',
    OPTIONS: 'options',
    RESULT: 'result',
    OBJECTIVE: 'objective',
    CONSTRAINTS: 'constraints',
    SENSITIVITY: 'sensitivity'
  }
  var url = "http://localhost:5000"
  //    var url = "https://peaceful-zion-91234.herokuapp.com/"

  let state = {
    current: SYS.SOURCE
  }

  function updateLog(content) {
    $('#log').val(`${$('#log').val()}${content}\n`)
  }

  $('#upload').click(() => {
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
        $('#source').val(content)
        if (state.current === SYS.SOURCE) {
          $('#textspace').val(content)
        }
        updateLog(`Content from ${filename} is placed into source text space.\n`)
        document.body.removeChild(input)
      }
    }
    input.click();
  })

  $('#download').click(() => {
    console.log('Downloading content')
    var content = $('#textspace').val()
    if (state.current === SYS.SOURCE) {
      $('#source').val(content)
    }
    var filename = 'lp_solve.txt'

    var a = document.createElement('a')
    var file = new Blob([content], { type: 'text/plain' })
    a.href = URL.createObjectURL(file)
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(function () {
      updateLog(`Content downloaded as ${filename}.\n`)
      document.body.removeChild(a)
    }, 0)
  })

  $('#run').click(() => {
    // If currently on source, first save all current progress.
    if (state.current === SYS.SOURCE) {
      $('#source').val($('#textspace').val())
    }

    var request_data = {
      content: $('#source').val()
    }

    updateLog('Now Running...')

    fetch(url, {
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

      $('#result').val(res.result)
      if (state.current === SYS.RESULT) {
        $('#textspace').val(res.result)
      }
    }).catch(function (e) {
      console.log(e)
      console.log('Error')
    })
  })

  /**
   * Changes the content of the text area into the values associated to the button clicked.
   */
  $('.tab-button').click((e) => {
    const clicked_button = $(e.target)
    var next_tab = clicked_button[0].id

    if (next_tab === 'result') {
      $('#result-dash').show()
    } else {
      $('#result-dash').hide()
    }

    var current_display = $('#textspace').val()
    $(`#${state.current}`).val(current_display)
    state.current = next_tab
    $('#textspace').val($(`#${next_tab}`).val())

    if (next_tab !== SYS.SOURCE) {
      $('#textspace').attr('readonly', true)
    } else {
      $('#textspace').attr('readonly', false)
    }
  })
})
